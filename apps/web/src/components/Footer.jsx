
import React from 'react';
import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function Footer() {
  const { language, toggleLanguage } = useLanguage();
  
  const texts = {
    tr: {
      rights: 'Tüm hakları saklıdır.',
      home: 'Ana Sayfa',
      translate: 'Çeviri Aracı',
      blog: 'Blog',
      about: 'Hakkımızda',
      contact: 'İletişim',
      privacy: 'Gizlilik Politikası',
      terms: 'Kullanım Koşulları',
      switchLang: 'Switch to English'
    },
    en: {
      rights: 'All rights reserved.',
      home: 'Home',
      translate: 'Translation Tool',
      blog: 'Blog',
      about: 'About Us',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      switchLang: 'Türkçe\'ye Geç'
    }
  };

  const t = texts[language];

  return (
    <footer className="bg-[#2C3E50] text-white py-12 mt-auto border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          <div className="md:col-span-4 flex flex-col items-center md:items-start gap-4">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <img 
                src="https://horizons-cdn.hostinger.com/64a08437-edd0-45e0-b726-9bfc5fe6b734/c9a95e343abec83650a769b59639f563.jpg"
                alt="TranslateBurn Logo"
                width="32"
                height="32"
                loading="lazy"
                className="h-8 w-8 rounded-full border border-white/50 object-cover"
              />
              <span className="text-lg font-bold tracking-tight">TranslateBurn</span>
            </Link>
            <p className="text-sm text-white/60 text-center md:text-left max-w-xs">
              © {new Date().getFullYear()} TranslateBurn. {t.rights}
            </p>
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-[#FF5722] transition-colors mt-2"
            >
              <Globe className="h-4 w-4" />
              {t.switchLang}
            </button>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Ürün / Product</h4>
              <Link to="/" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.home}</Link>
              <Link to="/translate" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.translate}</Link>
              <Link to="/blog" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.blog}</Link>
            </div>
            
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold text-white mb-2">Şirket / Company</h4>
              <Link to="/about" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.about}</Link>
              <Link to="/contact" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.contact}</Link>
            </div>

            <div className="flex flex-col gap-3 col-span-2 sm:col-span-1">
              <h4 className="font-semibold text-white mb-2">Yasal / Legal</h4>
              <Link to="/privacy" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.privacy}</Link>
              <a href="#" className="text-sm text-white/70 hover:text-[#FF5722] transition-colors">{t.terms}</a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
