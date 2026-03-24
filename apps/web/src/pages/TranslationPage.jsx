
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { ArrowRightLeft, Copy, Volume2, Star, Loader2, AlertCircle, RefreshCw, Trash2, WifiOff, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce.js';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis.js';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

import LanguageSelector from '@/components/LanguageSelector.jsx';
import TranslationHistory from '@/components/TranslationHistory.jsx';
import Favorites from '@/components/Favorites.jsx';
import WordDefinitionCard from '@/components/WordDefinitionCard.jsx';
import AdvertisingPlaceholder from '@/components/AdvertisingPlaceholder.jsx';

const CACHE_TTL = 24 * 60 * 60 * 1000;
const MAX_CACHE_SIZE = 100;
const API_TIMEOUT_MS = 5000;

const TranslationPage = React.memo(function TranslationPage() {
  const { language } = useLanguage();
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('EN');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [detectedLang, setDetectedLang] = useState('');
  
  const [isTranslating, setIsTranslating] = useState(false);
  const [isUsingCache, setIsUsingCache] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [definitions, setDefinitions] = useState([]);
  const [isDefLoading, setIsDefLoading] = useState(false);
  const [defError, setDefError] = useState(null);

  const [history, setHistory] = useLocalStorage('deepl-history', []);
  const [favorites, setFavorites] = useLocalStorage('deepl-favorites', []);
  const [translationCache, setTranslationCache] = useLocalStorage('translationCache', {});

  const debouncedText = useDebounce(sourceText, 300);
  const { speak, speaking } = useSpeechSynthesis();
  const abortControllerRef = useRef(null);
  const pendingRequestsRef = useRef(new Map());

  const t = {
    tr: {
      title: "Çeviri Aracı",
      subtitle: "DeepL API ile Güçlendirilmiştir",
      clearCache: "Önbelleği Temizle",
      sourcePlaceholder: "Metni buraya yazın veya yapıştırın...",
      targetPlaceholder: "Çeviri burada görünecek...",
      translating: "Çevriliyor...",
      retrying: "Yeniden deneniyor",
      offline: "Çevrimdışı",
      cached: "Önbellekten alındı",
      detected: "Algılanan",
      retry: "Tekrar Dene"
    },
    en: {
      title: "Translation Tool",
      subtitle: "Powered by DeepL API",
      clearCache: "Clear Cache",
      sourcePlaceholder: "Type or paste text here...",
      targetPlaceholder: "Translation will appear here...",
      translating: "Translating...",
      retrying: "Retrying",
      offline: "Offline",
      cached: "Using cached result",
      detected: "Detected",
      retry: "Retry"
    }
  }[language];

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getCacheKey = useCallback((text, source, target) => `${text.trim()}|${source}|${target}`, []);

  const handleClearCache = useCallback(() => {
    setTranslationCache({});
    toast.success(language === 'tr' ? 'Önbellek temizlendi' : 'Cache cleared');
  }, [setTranslationCache, language]);

  const performTranslation = useCallback(async (text, source, target, isManualRetry = false) => {
    if (!text.trim()) {
      setTranslatedText('');
      setDetectedLang('');
      setError(null);
      setRetryCount(0);
      setIsUsingCache(false);
      return;
    }

    if (isOffline) {
      setError(language === 'tr' ? 'Çevrimdışısınız. Lütfen bağlantınızı kontrol edin.' : 'You are offline. Please check your connection.');
      return;
    }

    const cacheKey = getCacheKey(text, source, target);
    const cachedEntry = translationCache[cacheKey];
    
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL)) {
      setTranslatedText(cachedEntry.result.translatedText);
      setDetectedLang(cachedEntry.result.detectedLanguage);
      setIsUsingCache(true);
      setError(null);
      setIsTranslating(false);
      return;
    }

    if (pendingRequestsRef.current.has(cacheKey)) return; 

    if (abortControllerRef.current) abortControllerRef.current.abort();
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsTranslating(true);
    setIsUsingCache(false);
    setError(null);

    let attempt = isManualRetry ? 0 : 0;
    let success = false;
    pendingRequestsRef.current.set(cacheKey, true);

    while (attempt <= 2 && !success) {
      if (abortController.signal.aborted) {
        pendingRequestsRef.current.delete(cacheKey);
        return;
      }

      setRetryCount(attempt);
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) abortControllerRef.current.abort('timeout');
      }, API_TIMEOUT_MS);

      try {
        const response = await apiServerClient.fetch('/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, targetLanguage: target, sourceLanguage: source === 'auto' ? undefined : source }),
          signal: abortController.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP error ${response.status}`);
        }
        
        const data = await response.json();

        if (data.success) {
          setTranslatedText(data.translatedText);
          setDetectedLang(data.detectedLanguage);
          setIsTranslating(false);
          setRetryCount(0);
          
          setTranslationCache(prev => {
            const newCache = { ...prev };
            newCache[cacheKey] = {
              result: { translatedText: data.translatedText, detectedLanguage: data.detectedLanguage },
              timestamp: Date.now(),
              language: target
            };
            const keys = Object.keys(newCache);
            if (keys.length > MAX_CACHE_SIZE) {
              const oldestKey = keys.sort((a, b) => newCache[a].timestamp - newCache[b].timestamp)[0];
              delete newCache[oldestKey];
            }
            return newCache;
          });

          const newHistoryItem = {
            id: Date.now().toString(),
            sourceText: text,
            translatedText: data.translatedText,
            sourceLang: data.detectedLanguage || source,
            targetLang: target,
            timestamp: Date.now()
          };
          
          setHistory(prev => {
            const filtered = prev.filter(item => item.sourceText !== text || item.targetLang !== target);
            return [newHistoryItem, ...filtered].slice(0, 50);
          });

          success = true;
          pendingRequestsRef.current.delete(cacheKey);
          return;
        }
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError' || err === 'timeout') {
          if (err === 'timeout' || (abortController.signal.reason === 'timeout')) {
            if (attempt >= 2) {
              setError(language === 'tr' ? 'İstek zaman aşımına uğradı.' : 'Request timed out.');
              setIsTranslating(false);
              pendingRequestsRef.current.delete(cacheKey);
              return;
            }
          } else {
            pendingRequestsRef.current.delete(cacheKey);
            return;
          }
        }

        if (attempt < 2) {
          attempt++;
        } else {
          const errorMessage = err.message ? `Error: ${err.message}` : 'Failed to translate';
          setError(errorMessage);
          setIsTranslating(false);
          pendingRequestsRef.current.delete(cacheKey);
          toast.error(errorMessage);
          return;
        }
      }
    }
  }, [getCacheKey, translationCache, setTranslationCache, setHistory, isOffline, language]);

  useEffect(() => {
    performTranslation(debouncedText, sourceLang, targetLang);
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [debouncedText, targetLang, sourceLang, performTranslation]);

  useEffect(() => {
    const fetchDefinition = async () => {
      const word = translatedText.trim();
      if (!word || word.includes(' ') || isTranslating) {
        setDefinitions([]);
        setDefError(null);
        return;
      }

      setIsDefLoading(true);
      setDefError(null);

      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (!response.ok) throw new Error('No definitions found.');
        const data = await response.json();
        if (data && data.length > 0 && data[0].meanings) {
          setDefinitions(data[0].meanings);
        } else {
          setDefinitions([]);
        }
      } catch (err) {
        setDefError(err.message);
        setDefinitions([]);
      } finally {
        setIsDefLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchDefinition, 600);
    return () => clearTimeout(timeoutId);
  }, [translatedText, isTranslating]);

  const handleManualRetry = useCallback(() => {
    performTranslation(debouncedText, sourceLang, targetLang, true);
  }, [performTranslation, debouncedText, sourceLang, targetLang]);

  const handleSwap = useCallback(() => {
    if (sourceLang === 'auto') {
      toast.info(language === 'tr' ? 'Otomatik algılama seçiliyken diller değiştirilemez' : 'Cannot swap when source is auto-detect');
      return;
    }
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setError(null);
    setRetryCount(0);
    setIsUsingCache(false);
  }, [sourceLang, targetLang, translatedText, language]);

  const handleCopy = useCallback(async (text) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(language === 'tr' ? 'Kopyalandı' : 'Copied to clipboard');
    } catch (err) {
      toast.error(language === 'tr' ? 'Kopyalama başarısız' : 'Failed to copy');
    }
  }, [language]);

  const handleSaveFavorite = useCallback(() => {
    if (!sourceText || !translatedText) return;
    const isAlreadySaved = favorites.some(f => f.sourceText === sourceText && f.targetLang === targetLang);
    if (isAlreadySaved) {
      toast.info(language === 'tr' ? 'Zaten favorilerde' : 'Already saved to favorites');
      return;
    }
    const newFav = {
      id: Date.now().toString(),
      sourceText,
      translatedText,
      sourceLang: detectedLang || sourceLang,
      targetLang,
      timestamp: Date.now()
    };
    setFavorites(prev => [newFav, ...prev]);
    toast.success(language === 'tr' ? 'Favorilere eklendi' : 'Saved to favorites');
  }, [sourceText, translatedText, targetLang, sourceLang, detectedLang, favorites, setFavorites, language]);

  const restoreItem = useCallback((item) => {
    setSourceLang(item.sourceLang);
    setTargetLang(item.targetLang);
    setSourceText(item.sourceText);
    setError(null);
    setRetryCount(0);
  }, []);

  const statusDisplay = useMemo(() => {
    if (isOffline) return <span className="flex items-center text-destructive"><WifiOff className="h-3 w-3 mr-1" /> {t.offline}</span>;
    if (isTranslating) {
      return (
        <span className="flex items-center text-primary font-medium">
          <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> 
          {retryCount > 0 ? `${t.retrying} (${retryCount}/2)...` : t.translating}
        </span>
      );
    }
    if (isUsingCache && translatedText) {
      return <span className="flex items-center text-muted-foreground"><CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-green-500" /> {t.cached}</span>;
    }
    return null;
  }, [isOffline, isTranslating, retryCount, isUsingCache, translatedText, t]);

  return (
    <div className="w-full">
      <Helmet>
        <title>{t.title} - TranslateBurn</title>
      </Helmet>

      <AdvertisingPlaceholder size="leaderboard" className="mb-8" />

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-secondary dark:text-white">{t.title}</h1>
          <p className="text-muted-foreground mt-1 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleClearCache} className="text-xs h-9 border-border hover:bg-muted">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            {t.clearCache}
          </Button>
          <TranslationHistory 
            history={history} 
            onRestore={restoreItem} 
            onClear={() => setHistory([])}
            onRemove={(id) => setHistory(prev => prev.filter(i => i.id !== id))}
          />
          <Favorites 
            favorites={favorites} 
            onRestore={restoreItem}
            onRemove={(id) => setFavorites(prev => prev.filter(i => i.id !== id))}
          />
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-start">
        {/* Source Panel */}
        <article className="card-custom p-5 flex flex-col gap-4">
          <LanguageSelector 
            label={language === 'tr' ? 'Çevrilecek Dil' : 'Translate from'} 
            value={sourceLang} 
            onChange={setSourceLang} 
            showAutoDetect 
          />
          <div className="relative">
            <Textarea
              value={sourceText}
              onChange={(e) => { setSourceText(e.target.value); setError(null); setRetryCount(0); }}
              placeholder={t.sourcePlaceholder}
              className="textarea-custom min-h-[280px] text-lg"
            />
            {sourceText && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-card/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-border">
                <Button variant="ghost" size="icon" onClick={() => handleCopy(sourceText)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => speak(sourceText, sourceLang === 'auto' ? detectedLang : sourceLang)} disabled={speaking} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between h-6">
            {detectedLang && sourceLang === 'auto' && (
              <div className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                {t.detected}: {detectedLang}
              </div>
            )}
            <div className="text-xs ml-auto">{statusDisplay}</div>
          </div>
        </article>

        {/* Swap Button */}
        <div className="flex justify-center lg:pt-[4.5rem] py-2 lg:py-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSwap}
            disabled={sourceLang === 'auto'}
            className="rounded-full h-12 w-12 shadow-sm hover:shadow-md border-border hover:border-primary hover:text-primary transition-all bg-white dark:bg-card"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Target Panel */}
        <article className="card-custom p-5 flex flex-col gap-4 relative overflow-hidden">
          <LanguageSelector 
            label={language === 'tr' ? 'Hedef Dil' : 'Translate to'} 
            value={targetLang} 
            onChange={setTargetLang} 
          />
          <div className="relative min-h-[280px] flex flex-col">
            <Textarea
              value={translatedText}
              readOnly
              placeholder={t.targetPlaceholder}
              className={`textarea-custom flex-1 text-lg font-medium ${isTranslating ? 'opacity-50' : 'opacity-100'}`}
            />
            {translatedText && !error && (
              <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/90 dark:bg-card/90 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-border z-20">
                <Button variant="ghost" size="icon" onClick={handleSaveFavorite} className="h-8 w-8 text-muted-foreground hover:text-yellow-500">
                  <Star className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleCopy(translatedText)} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => speak(translatedText, targetLang)} disabled={speaking} className="h-8 w-8 text-muted-foreground hover:text-primary">
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {error && (
            <div className="flex items-start gap-3 text-destructive text-sm bg-destructive/10 p-3.5 rounded-lg border border-destructive/20 mt-2">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="font-medium">{error}</p>
                <Button variant="outline" size="sm" onClick={handleManualRetry} className="h-8 px-3 text-xs shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-white">
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                  {t.retry}
                </Button>
              </div>
            </div>
          )}
        </article>
      </section>

      {(isDefLoading || defError || definitions.length > 0) && (
        <section className="mt-10 max-w-3xl mx-auto">
          <WordDefinitionCard 
            word={translatedText.trim()}
            language={targetLang}
            isLoading={isDefLoading}
            error={defError}
            definitions={definitions}
          />
        </section>
      )}
      
      <AdvertisingPlaceholder size="leaderboard" className="mt-12" />
    </div>
  );
});

export default TranslationPage;
