'use client';

import React, { useEffect } from 'react';
import { useThemeStore } from '@/store/themeStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | 'purple' | null;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('light');
    }
  }, [setTheme]);

  return <>{children}</>;
}

