
import React, { useState, useMemo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Search, BookOpen, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import ArticleCard from '@/components/ArticleCard.jsx';
import { getAllArticles, searchArticles } from '@/data/articles.js';
import { generateBlogSchema } from '@/utils/seoHelpers.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const ARTICLES_PER_PAGE = 10;

export default function BlogPage() {
  const { language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const allArticles = getAllArticles();

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) {
      return allArticles;
    }
    return searchArticles(searchQuery, language);
  }, [searchQuery, allArticles, language]);

  const totalPages = Math.ceil(filteredArticles.length / ARTICLES_PER_PAGE);
  
  const currentArticles = useMemo(() => {
    const start = (currentPage - 1) * ARTICLES_PER_PAGE;
    return filteredArticles.slice(start, start + ARTICLES_PER_PAGE);
  }, [filteredArticles, currentPage]);

  // Sync search query to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
      params.set('page', '1'); // Reset to page 1 on new search
    } else {
      params.delete('q');
    }
    setSearchParams(params, { replace: true });
  }, [searchQuery, setSearchParams]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = {
    tr: {
      title: "TranslateBurn Blog",
      desc: "Çeviri teknolojileri, dil öğrenimi ve yapay zeka destekli araçlar hakkında güncel makaleler",
      searchPlaceholder: "Makalelerde ara...",
      noResults: "Sonuç bulunamadı",
      noResultsDesc: `"${searchQuery}" için makale bulunamadı. Farklı bir arama terimi deneyin.`,
      clearSearch: "Aramayı Temizle",
      prev: "Önceki",
      next: "Sonraki",
      page: "Sayfa"
    },
    en: {
      title: "TranslateBurn Blog",
      desc: "Latest articles on translation technologies, language learning, and AI-powered tools",
      searchPlaceholder: "Search articles...",
      noResults: "No results found",
      noResultsDesc: `No articles found for "${searchQuery}". Try a different search term.`,
      clearSearch: "Clear Search",
      prev: "Previous",
      next: "Next",
      page: "Page"
    }
  }[language];

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>TranslateBurn Blog – AI Çeviri İpuçları, Rehberler ve Araç Karşılaştırmaları</title>
        <meta name="description" content="TranslateBurn blog'unda çeviri ipuçları, AI araçları karşılaştırması, profesyonel çeviri rehberleri ve dil öğrenme stratejileri bulun." />
        <meta property="og:title" content="TranslateBurn Blog – AI Çeviri İpuçları, Rehberler ve Araç Karşılaştırmaları" />
        <meta property="og:description" content="TranslateBurn blog'unda çeviri ipuçları, AI araçları karşılaştırması, profesyonel çeviri rehberleri ve dil öğrenme stratejileri bulun." />
        <meta property="og:type" content="blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="TranslateBurn Blog – AI Çeviri İpuçları" />
        <meta name="twitter:description" content="TranslateBurn blog'unda çeviri ipuçları, AI araçları karşılaştırması ve profesyonel çeviri rehberleri bulun." />
        <script type="application/ld+json">
          {JSON.stringify(generateBlogSchema())}
        </script>
      </Helmet>

      <header className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-primary" aria-hidden="true" />
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-secondary dark:text-white">
            {t.title}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t.desc}
        </p>
      </header>

      <div className="max-w-2xl mx-auto mb-16">
        <div className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <Input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-12 h-14 text-base rounded-xl border-[#DDD] focus:border-primary focus:ring-primary shadow-sm text-gray-900 dark:text-white"
            aria-label={t.searchPlaceholder}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-4 p-1 text-muted-foreground hover:text-secondary dark:hover:text-white transition-colors"
              aria-label={t.clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="w-full">
        {currentArticles.length > 0 ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" aria-label="Blog Articles">
              {currentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </section>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-16">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-border text-secondary dark:text-white hover:bg-muted"
                >
                  {t.prev}
                </Button>
                
                <div className="flex items-center gap-1 mx-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                    <Button
                      key={num}
                      variant={currentPage === num ? "default" : "ghost"}
                      onClick={() => handlePageChange(num)}
                      className={`w-10 h-10 p-0 ${currentPage === num ? 'bg-primary text-white hover:bg-primary/90' : 'text-secondary dark:text-white hover:bg-muted'}`}
                      aria-label={`${t.page} ${num}`}
                      aria-current={currentPage === num ? "page" : undefined}
                    >
                      {num}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-border text-secondary dark:text-white hover:bg-muted"
                >
                  {t.next}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-card rounded-2xl border border-border shadow-sm max-w-2xl mx-auto">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" aria-hidden="true" />
            <h2 className="text-2xl font-bold mb-2 text-secondary dark:text-white">{t.noResults}</h2>
            <p className="text-muted-foreground mb-6">{t.noResultsDesc}</p>
            <Button variant="outline" onClick={() => setSearchQuery('')} className="border-primary text-primary hover:bg-primary hover:text-white">
              {t.clearSearch}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
