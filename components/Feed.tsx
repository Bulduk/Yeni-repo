'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import FeedCard from './FeedCard';
import BottomNav from './BottomNav';
import { Search, User, BarChart2, Plus, Activity, Wallet, X, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeStore } from '@/store/themeStore';
import { useLanguage } from '@/providers/LanguageProvider';

export default function Feed() {
  const { markets, setMarkets, portfolio, setPortfolio, updateMarketPrice } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  
  const { currentTheme, setTheme } = useThemeStore();
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
      const [marketsRes, portfolioRes] = await Promise.all([
        fetch('/api/markets'),
        fetch('/api/portfolio')
      ]);
      const marketsData = await marketsRes.json();
      const portfolioData = await portfolioRes.json();
      
      setMarkets(marketsData.markets);
      setPortfolio(portfolioData);
      setLoading(false);
    };
    fetchData();
  }, [setMarkets, setPortfolio]);


  if (loading) {
    return <div className="h-[100dvh] w-full flex items-center justify-center bg-bg-base text-text-primary">Loading...</div>;
  }

  return (
    <div className="h-[100dvh] w-full bg-bg-base overflow-hidden relative text-text-primary font-sans">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 z-[100] flex justify-between items-center p-4 pt-[calc(env(safe-area-inset-top,1rem)+0.5rem)] bg-bg-base/90 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-bold text-white text-lg">P</div>
          <div className="text-xl font-bold text-text-primary tracking-wide">Predix</div>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setShowWallet(true)} className="w-10 h-10 rounded-full bg-text-primary/5 border border-border-color flex items-center justify-center text-text-secondary hover:bg-text-primary/10 transition-colors">
            <Wallet className="w-5 h-5" />
          </button>
          <button onClick={() => setShowSettings(true)} className="w-10 h-10 rounded-full bg-text-primary/5 border border-border-color flex items-center justify-center text-text-secondary hover:bg-text-primary/10 transition-colors">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Feed Container */}
      <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory hide-scrollbar pb-20">
        {markets.map((market) => (
          <div key={market.id} className="h-full w-full snap-start snap-always relative">
            <FeedCard market={market} />
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Wallet Modal */}
      <AnimatePresence>
        {showWallet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-bg-base/80 backdrop-blur-md p-4"
            onClick={() => setShowWallet(false)}
          >
            <motion.div
              initial={{ y: '100%', scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-bg-surface border border-border-color w-full max-w-sm rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-text-primary">{t('wallet')}</h3>
                <button onClick={() => setShowWallet(false)} className="w-8 h-8 rounded-full bg-border-color/50 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4">
                <span className="text-sm font-medium text-text-secondary mb-1">{t('balance')}</span>
                <span className="text-4xl font-mono font-bold text-text-primary">${portfolio?.balance.toFixed(2)}</span>
                {portfolio?.totalProfit && (
                  <span className="text-sm font-mono font-bold text-yes mt-2">
                    +{t('profit')}: ${portfolio.totalProfit.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 flex items-center justify-center space-x-2 bg-text-primary text-bg-base py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>{t('deposit')}</span>
                </button>
                <button className="flex-1 flex items-center justify-center space-x-2 bg-bg-base border border-border-color text-text-primary py-3 rounded-xl font-bold hover:bg-border-color/50 transition-colors">
                  <ArrowUpFromLine className="w-4 h-4" />
                  <span>{t('withdraw')}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-bg-base/80 backdrop-blur-md p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: '100%', scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: '100%', scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-bg-surface border border-border-color w-full max-w-sm rounded-[2rem] p-6 flex flex-col gap-6 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-display font-bold text-text-primary">{t('settings')}</h3>
                <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-border-color/50 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex flex-col gap-4">
                {/* Theme Selector */}
                <div>
                  <label className="text-sm font-bold text-text-secondary mb-2 block">{t('theme')}</label>
                  <div className="flex space-x-2">
                    <button onClick={() => setTheme('light')} className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${currentTheme === 'light' ? 'bg-text-primary text-bg-base border-text-primary' : 'bg-bg-base text-text-primary border-border-color'}`}>☀️ {t('light')}</button>
                    <button onClick={() => setTheme('dark')} className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${currentTheme === 'dark' ? 'bg-text-primary text-bg-base border-text-primary' : 'bg-bg-base text-text-primary border-border-color'}`}>🌙 {t('dark')}</button>
                    <button onClick={() => setTheme('purple')} className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${currentTheme === 'purple' ? 'bg-accent text-bg-base border-accent' : 'bg-bg-base text-text-primary border-border-color'}`}>🟣 {t('purple')}</button>
                  </div>
                </div>

                {/* Language Selector */}
                <div>
                  <label className="text-sm font-bold text-text-secondary mb-2 block">{t('language')}</label>
                  <div className="flex space-x-2">
                    <button onClick={() => setLang('tr')} className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${lang === 'tr' ? 'bg-text-primary text-bg-base border-text-primary' : 'bg-bg-base text-text-primary border-border-color'}`}>🇹🇷 Türkçe</button>
                    <button onClick={() => setLang('en')} className={`flex-1 py-2 rounded-xl border text-sm font-bold transition-colors ${lang === 'en' ? 'bg-text-primary text-bg-base border-text-primary' : 'bg-bg-base text-text-primary border-border-color'}`}>🇺🇸 English</button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
