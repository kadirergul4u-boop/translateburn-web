
import React, { useState } from 'react';
import { Moon, Sun, Menu, X, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { useTheme } from '@/contexts/ThemeProvider.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: language === 'tr' ? 'Ana Sayfa' : 'Home' },
    { path: '/translate', label: language === 'tr' ? 'Çeviri' : 'Translate' },
    { path: '/blog', label: 'Blog' },
    { path: '/about', label: language === 'tr' ? 'Hakkımızda' : 'About' },
    { path: '/contact', label: language === 'tr' ? 'İletişim' : 'Contact' }
  ];

  return (
    <header className="site-header">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex h-16 items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
            aria-label="TranslateBurn Home"
          >
            <img 
              src="https://horizons-cdn.hostinger.com/64a08437-edd0-45e0-b726-9bfc5fe6b734/c9a95e343abec83650a769b59639f563.jpg"
              alt="TranslateBurn Logo"
              width="40"
              height="40"
              loading="eager"
              className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <span className="text-xl font-bold tracking-tight text-white">
              TranslateBurn
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-primary' : 'text-white hover:text-primary'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
            
            <div className="flex items-center gap-2 ml-4 border-l border-white/20 pl-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLanguage}
                className="text-white hover:text-primary hover:bg-white/10 transition-colors"
                aria-label="Toggle Language"
              >
                <Globe className="h-4 w-4 mr-2" />
                {language.toUpperCase()}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
                className="text-white hover:text-primary hover:bg-white/10 transition-colors"
              >
                {theme === 'light' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              className="text-white hover:bg-white/10"
            >
              <span className="font-bold text-sm">{language.toUpperCase()}</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/10 px-4 py-4 space-y-4 shadow-lg">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link 
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-base font-medium py-2 ${isActive ? 'text-primary' : 'text-white'}`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-sm text-white/70">{language === 'tr' ? 'Tema Değiştir' : 'Toggle Theme'}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              {theme === 'light' ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {theme === 'light' ? 'Light' : 'Dark'}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
