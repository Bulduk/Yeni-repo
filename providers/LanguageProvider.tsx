'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { t as translate } from '@/lib/i18n';

type LanguageContextType = {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState('tr');

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved) {
      // eslint-disable-next-line
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: string) => {
    setLangState(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key: string) => translate(lang, key);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
