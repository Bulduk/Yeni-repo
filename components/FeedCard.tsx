'use client';

import Image from 'next/image';
import React, { useState, useEffect, useMemo } from 'react';
import { Market, useAppStore } from '@/lib/store';
import { useUIStore } from '@/store/uiStore';
import { motion, AnimatePresence } from 'motion/react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { Activity, Users, Sparkles, Zap, TrendingUp, Target } from 'lucide-react';

const MarketChart = React.memo(({ data }: { data: any[] }) => {
  const chartData = useMemo(() => {
    return data.map(d => ({
      ...d,
      yes: d.price,
    }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData}>
        <YAxis domain={[0, 100]} hide />
        <Line 
          type="monotone" 
          dataKey="yes" 
          stroke="var(--yes)" 
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
MarketChart.displayName = 'MarketChart';

export default function FeedCard({ market }: { market: Market }) {
  const prevPriceRef = React.useRef(market.yesProb);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);
  const { setActiveMarketId } = useUIStore();
  
  useEffect(() => {
    const prevPrice = prevPriceRef.current;
    if (market.yesProb > prevPrice) {
      setTimeout(() => setFlash('up'), 0);
      const timer = setTimeout(() => setFlash(null), 600);
      prevPriceRef.current = market.yesProb;
      return () => clearTimeout(timer);
    } else if (market.yesProb < prevPrice) {
      setTimeout(() => setFlash('down'), 0);
      const timer = setTimeout(() => setFlash(null), 600);
      prevPriceRef.current = market.yesProb;
      return () => clearTimeout(timer);
    }
  }, [market.yesProb]);

  const chart = market.chartData || [];
  const { openTradeSheet } = useUIStore();

  return (
    <div className="h-full w-full bg-bg-base pt-28 pb-24 px-4 flex flex-col overflow-y-auto cursor-pointer" onClick={() => setActiveMarketId(market.id)}>
      
      {/* Price Flash Overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ backgroundColor: flash === 'up' ? 'var(--yes)' : 'var(--no)' }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col justify-center h-full">
        
        {/* Badges Row 1 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-3 py-1 rounded-full border border-border-color bg-text-primary/5 text-xs font-bold text-text-primary tracking-wide">
            CRYPTO
          </div>
          <div className="px-3 py-1 rounded-full border border-no/30 bg-no/10 text-xs font-bold text-no flex items-center gap-1.5 tracking-wide">
            <div className="w-1.5 h-1.5 rounded-full bg-no animate-pulse"></div>
            LIVE
          </div>
          {market.whaleActivity && (
            <div className="px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-xs font-bold text-yellow-600 dark:text-yellow-500 flex items-center gap-1.5 tracking-wide">
              <span>🐋</span> Whale active
            </div>
          )}
          <div className="px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 tracking-wide">
            <Users className="w-3.5 h-3.5" />
            {market.copyCount} copying
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary leading-[1.1] mb-6 tracking-tight">
          {market.question}
        </h1>

        {/* Creator Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Image 
              src={`https://i.pravatar.cc/150?u=${market.id}`} 
              alt="Creator" 
              width={40} 
              height={40} 
              className="rounded-full border border-border-color" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase">CREATED BY</span>
              <span className="text-sm font-bold text-text-primary">Satoshi_N</span>
            </div>
          </div>
          <button className="px-5 py-1.5 rounded-full bg-accent text-white text-sm font-bold hover:opacity-90 transition-opacity">
            Follow
          </button>
        </div>

        {/* Badges Row 2 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="px-3 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-xs font-bold text-accent flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {market.yesProb.toFixed(0)}% YES
          </div>
          <div className="px-3 py-1.5 rounded-full border border-border-color bg-text-primary/5 text-xs font-bold text-text-secondary flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Bullish
          </div>
          <div className="px-3 py-1.5 rounded-full border border-border-color bg-text-primary/5 text-xs font-bold text-text-secondary">
            45d 12h
          </div>
        </div>

        {/* Chart Area */}
        <div className="h-32 w-full mb-6 relative">
          {chart.length > 0 && (
            <MarketChart data={chart} />
          )}
        </div>

        {/* Action Icons Row */}
        <div className="flex justify-end gap-2 mb-6">
          <button className="w-8 h-8 rounded-full border border-border-color bg-text-primary/5 flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-text-primary/10 transition-colors">
            <Activity className="w-4 h-4" />
          </button>
          <button className="h-8 px-3 rounded-full border border-orange-500/30 bg-orange-500/10 flex items-center gap-1.5 text-orange-600 dark:text-orange-500 font-bold text-xs hover:bg-orange-500/20 transition-colors">
            <Zap className="w-3 h-3" />
            <span>+2 | -1</span>
          </button>
          <button className="w-8 h-8 rounded-full border border-yes/30 bg-yes/10 flex items-center justify-center text-yes hover:bg-yes/20 transition-colors">
            <TrendingUp className="w-4 h-4" />
          </button>
          <button className="h-8 px-3 rounded-full border border-accent/30 bg-accent/10 flex items-center gap-1.5 text-accent font-bold text-xs hover:bg-accent/20 transition-colors">
            <Target className="w-3 h-3" />
            <span>85%</span>
          </button>
        </div>

        {/* Trading Bar */}
        <div>
          <div className="h-16 w-full rounded-2xl overflow-hidden flex relative border border-border-color">
            {/* YES Side */}
            <button 
              onClick={(e) => { e.stopPropagation(); openTradeSheet(market.id, 'YES'); }}
              className="h-full flex flex-col justify-center px-4 relative transition-all hover:brightness-110"
              style={{ width: `${market.yesProb}%`, backgroundColor: 'var(--yes)', opacity: 0.9 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex flex-col items-start">
                  <span className="font-bold text-lg text-white leading-none">YES</span>
                  <span className="text-sm text-white/90 font-medium">{market.yesProb.toFixed(0)}%</span>
                </div>
                <span className="text-xs font-bold text-white/60 bg-black/20 px-2 py-1 rounded-md">+$345</span>
              </div>
            </button>

            {/* NO Side */}
            <button 
              onClick={(e) => { e.stopPropagation(); openTradeSheet(market.id, 'NO'); }}
              className="h-full flex flex-col justify-center items-end px-4 relative transition-all hover:brightness-110"
              style={{ width: `${100 - market.yesProb}%`, backgroundColor: 'var(--no)', opacity: 0.9 }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-end">
                <span className="font-bold text-lg text-white leading-none">NO</span>
                <span className="text-sm text-white/90 font-medium">{(100 - market.yesProb).toFixed(0)}%</span>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
