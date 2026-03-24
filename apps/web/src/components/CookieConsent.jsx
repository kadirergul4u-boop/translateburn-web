
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function CookieConsent() {
  const { language } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none"
        >
          <div className="bg-[#2C3E50] text-white border-t-2 border-[#FF5722] p-[20px] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] w-full max-w-5xl pointer-events-auto relative flex flex-col md:flex-row items-center gap-4 md:gap-8 md:rounded-t-2xl">
            <button 
              onClick={handleClose} 
              className="absolute top-3 right-3 p-1.5 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="flex-1 text-sm md:text-base pr-6 md:pr-0 text-center md:text-left leading-relaxed">
              {language === 'tr' 
                ? 'Bu siteyi kullanmaya devam ederek çerez kullanımını kabul etmiş olursunuz.' 
                : 'By continuing to use this site, you accept our use of cookies.'}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-center">
              <button 
                onClick={handleDecline} 
                className="flex-1 md:flex-none px-6 py-2.5 rounded-lg border border-white bg-transparent text-white hover:bg-white/10 transition-colors text-sm font-semibold"
              >
                {language === 'tr' ? 'Reddet' : 'Decline'}
              </button>
              <button 
                onClick={handleAccept} 
                className="flex-1 md:flex-none px-6 py-2.5 rounded-lg bg-[#FF5722] text-white hover:bg-[#E64A19] transition-colors text-sm font-semibold shadow-sm"
              >
                {language === 'tr' ? 'Kabul Et' : 'Accept'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
