import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'purple';

interface ThemeState {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'light',
  setTheme: (theme) => {
    set({ currentTheme: theme });
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
  },
}));
