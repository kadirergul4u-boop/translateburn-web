
import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner.jsx';
import { ThemeProvider } from '@/contexts/ThemeProvider.jsx';
import { LanguageProvider } from '@/contexts/LanguageContext.jsx';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import CookieConsent from '@/components/CookieConsent.jsx';
import Clock from '@/components/Clock.jsx';

import HomePage from '@/pages/HomePage.jsx';
import TranslationPage from '@/pages/TranslationPage.jsx';
import BlogPage from '@/pages/BlogPage.jsx';
import ArticleDetailPage from '@/pages/ArticleDetailPage.jsx';
import PrivacyPage from '@/pages/PrivacyPage.jsx';
import AboutPage from '@/pages/AboutPage.jsx';
import ContactPage from '@/pages/ContactPage.jsx';
import NotFoundPage from '@/pages/NotFoundPage.jsx';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-background relative">
            <Header />
            
            <div className="flex-1 w-full">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/translate" element={
                  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <TranslationPage />
                  </div>
                } />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<ArticleDetailPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>

            <Footer />
            
            {/* Global Overlays */}
            <Clock />
            <CookieConsent />
          </div>
          <Toaster position="bottom-right" />
        </Router>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
