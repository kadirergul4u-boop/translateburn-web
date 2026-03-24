
import React, { useEffect, useContext } from 'react';
import { ThemeContext } from './ThemeContext.jsx';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('translateburn-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
