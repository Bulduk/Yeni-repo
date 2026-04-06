'use client';

import React, { useState, useEffect, memo } from 'react';
import { useAppStore, Market } from '@/lib/store';
import { useUIStore } from '@/store/uiStore';
import { Clock, TrendingUp, Star, Flame, Zap, Activity, Trophy, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import BottomNav from './BottomNav';
import Image from 'next/image';

const TABS = ['Favorites', 'Hot', 'Alpha', 'New', 'Gainers'];
const CATEGORIES = ['All', 'Crypto', 'Politics', 'Sports', 'AI', 'Economy'];

// --- Subcomponents ---

const MarketCard = memo(({ market }: { market: Market }) => {
  const { setActiveMarketId, openTradeSheet } = useUIStore();
  
  const handleTrade = (e: React.MouseEvent, type: 'YES' | 'NO') => {
    e.stopPropagation();
    openTradeSheet(market.id, type);
  };

  return (
    <div 
      onClick={() => setActiveMarketId(market.id)}
      className="bg-bg-surface border border-border-color rounded-2xl p-4 mb-3 cursor-pointer hover:border-accent transition-colors active:scale-[0.98]"
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-sm font-bold leading-snug text-text-primary line-clamp-2 flex-1">
          {market.question}
        </h3>
        <div className="flex flex-col items-end shrink-0">
          <span className="text-xs font-bold text-text-secondary mb-1">
            ${(market.volume / 1000).toFixed(1)}k
          </span>
          <span className="text-[10px] text-text-secondary flex items-center gap-1 bg-bg-base px-1.5 py-0.5 rounded-md">
            <Clock className="w-3 h-3" />
            {market.timeLeft || '45d'}
          </span>
        </div>
      </div>

      {/* Category-Aware Rendering */}
      {market.category === 'Crypto' && (
        <div className="flex items-center gap-2 mb-3 text-xs text-text-secondary">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span>Price Target Market</span>
        </div>
      )}
      {market.category === 'Sports' && (
        <div className="flex items-center gap-2 mb-3 text-xs text-text-secondary">
          <Trophy className="w-3.5 h-3.5 text-accent" />
          <span>Match Prediction</span>
        </div>
      )}
      {market.category === 'Poll' && (
        <div className="flex items-center gap-2 mb-3 text-xs text-text-secondary">
          <Users className="w-3.5 h-3.5 text-accent" />
          <span>Public Opinion</span>
        </div>
      )}

      {/* Mini Bar */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1 h-1.5 bg-border-color rounded-full overflow-hidden flex">
          <div className="h-full bg-yes transition-all duration-500" style={{ width: `${market.yesProb}%` }} />
          <div className="h-full bg-no transition-all duration-500" style={{ width: `${100 - market.yesProb}%` }} />
        </div>
      </div>

      {/* Quick Trade Buttons */}
      <div className="flex gap-2">
        <button 
          onClick={(e) => handleTrade(e, 'YES')}
          className="flex-1 py-2 rounded-xl bg-yes/10 text-yes font-bold text-sm flex items-center justify-center gap-2 hover:bg-yes/20 transition-colors"
        >
          YES {market.yesProb.toFixed(0)}¢
        </button>
        <button 
          onClick={(e) => handleTrade(e, 'NO')}
          className="flex-1 py-2 rounded-xl bg-no/10 text-no font-bold text-sm flex items-center justify-center gap-2 hover:bg-no/20 transition-colors"
        >
          NO {(100 - market.yesProb).toFixed(0)}¢
        </button>
      </div>
    </div>
  );
});
MarketCard.displayName = 'MarketCard';

const HeatmapBlock = memo(({ market }: { market: Market }) => {
  const { setActiveMarketId } = useUIStore();
  const isBullish = market.yesProb >= 50;
  
  return (
    <div 
      onClick={() => setActiveMarketId(market.id)}
      className={`p-3 rounded-xl cursor-pointer transition-transform active:scale-95 flex flex-col justify-between h-20 ${
        isBullish ? 'bg-yes/10 border border-yes/20' : 'bg-no/10 border border-no/20'
      }`}
    >
      <span className="text-[10px] font-bold text-text-primary line-clamp-2 leading-tight">
        {market.question}
      </span>
      <div className="flex items-center justify-between mt-1">
        <span className={`text-xs font-bold ${isBullish ? 'text-yes' : 'text-no'}`}>
          {market.yesProb.toFixed(0)}%
        </span>
        {isBullish ? <ArrowUpRight className="w-3 h-3 text-yes" /> : <ArrowDownRight className="w-3 h-3 text-no" />}
      </div>
    </div>
  );
});
HeatmapBlock.displayName = 'HeatmapBlock';

// --- Main Component ---

export default function Markets() {
  const { markets, setMarkets } = useAppStore();
  const { setActiveMarketId, openTradeSheet } = useUIStore();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Hot');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/markets');
        const data = await res.json();
        setMarkets(data.markets);
      } catch (err) {
        console.error('Failed to fetch markets', err);
      } finally {
        setLoading(false);
      }
    };
    if (markets.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [markets.length, setMarkets]);

  const filteredMarkets = markets.filter(m => {
    if (activeCategory !== 'All' && m.category !== activeCategory) return false;
    return true;
  }).sort((a, b) => b.volume - a.volume);

  const featuredMarket = markets.length > 0 ? markets[0] : null;
  const heatmapMarkets = markets.slice(1, 7); // Show 6 items in heatmap

  if (loading) {
    return <div className="h-[100dvh] w-full flex items-center justify-center bg-bg-base text-text-primary">Loading...</div>;
  }

  return (
    <div className="h-[100dvh] w-full bg-bg-base flex flex-col text-text-primary font-sans overflow-hidden">
      
      {/* 1) TOP HEADER (sticky) */}
      <div className="sticky top-0 z-40 bg-bg-base/90 backdrop-blur-md border-b border-border-color shrink-0 pt-[calc(env(safe-area-inset-top,1rem)+0.5rem)]">
        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 pb-2 gap-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold whitespace-nowrap transition-colors relative pb-2 ${
                activeTab === tab ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-text-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        
        {/* Category Chips */}
        <div className="flex overflow-x-auto hide-scrollbar px-4 py-3 gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                activeCategory === cat 
                  ? 'bg-text-primary text-bg-base' 
                  : 'bg-bg-surface border border-border-color text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4 hide-scrollbar">
        
        {/* 2) FEATURED / COUNTDOWN MARKET */}
        {featuredMarket && activeCategory === 'All' && activeTab === 'Hot' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Featured</h2>
            </div>
            <div 
              onClick={() => setActiveMarketId(featuredMarket.id)}
              className="relative overflow-hidden rounded-3xl bg-bg-surface border border-border-color p-5 cursor-pointer hover:border-accent transition-colors"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
              
              <div className="flex justify-between items-start gap-4 mb-4 relative z-10">
                <h3 className="text-lg font-bold text-text-primary leading-tight">
                  {featuredMarket.question}
                </h3>
              </div>
              
              <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="flex items-center gap-1.5 bg-bg-base px-2.5 py-1 rounded-lg border border-border-color">
                  <Clock className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-bold text-text-primary">{featuredMarket.timeLeft || 'Ends in 2d 14h'}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-bg-base px-2.5 py-1 rounded-lg border border-border-color">
                  <TrendingUp className="w-3.5 h-3.5 text-text-secondary" />
                  <span className="text-xs font-bold text-text-primary">${(featuredMarket.volume / 1000).toFixed(1)}k Vol</span>
                </div>
              </div>

              <div className="flex gap-3 relative z-10">
                <button 
                  onClick={(e) => { e.stopPropagation(); openTradeSheet(featuredMarket.id, 'YES'); }}
                  className="flex-1 h-12 rounded-xl bg-yes text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Buy YES {featuredMarket.yesProb.toFixed(0)}¢
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); openTradeSheet(featuredMarket.id, 'NO'); }}
                  className="flex-1 h-12 rounded-xl bg-no text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  Buy NO {(100 - featuredMarket.yesProb).toFixed(0)}¢
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3) HEATMAP SECTION */}
        {heatmapMarkets.length > 0 && activeCategory === 'All' && activeTab === 'Hot' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Market Heat</h2>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {heatmapMarkets.map(market => (
                <HeatmapBlock key={market.id} market={market} />
              ))}
            </div>
          </div>
        )}

        {/* 4) MARKET LIST */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">
              {activeCategory !== 'All' ? `${activeCategory} Markets` : 'Trending Markets'}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            {filteredMarkets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
            {filteredMarkets.length === 0 && (
              <div className="p-8 text-center text-text-secondary text-sm col-span-full border border-border-color rounded-2xl border-dashed">
                No markets found for this category.
              </div>
            )}
          </div>
        </div>

        {/* 6) LEADERBOARD (BOTTOM) */}
        {activeCategory === 'All' && activeTab === 'Hot' && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Top Traders</h2>
            </div>
            <div className="bg-bg-surface border border-border-color rounded-2xl overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border-b border-border-color last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-text-secondary font-bold text-sm w-4">{i}</span>
                    <Image 
                      src={`https://i.pravatar.cc/150?u=trader${i}`} 
                      alt="Trader" 
                      width={36} 
                      height={36} 
                      className="rounded-full border border-border-color" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-primary">Trader_{i}9x</span>
                      <span className="text-[10px] text-text-secondary flex items-center gap-1">
                        <Users className="w-3 h-3" /> {1200 - i * 150} copiers
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-yes">+{((4 - i) * 12.5).toFixed(1)}k</span>
                    <span className="text-[10px] text-text-secondary">PnL (30d)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <BottomNav />
    </div>
  );
}
