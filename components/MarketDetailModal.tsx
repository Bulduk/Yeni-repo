'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { useUIStore } from '@/store/uiStore';
import { X, Users, Sparkles, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import Image from 'next/image';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

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
        <Tooltip 
          contentStyle={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-color)', borderRadius: '8px' }}
          itemStyle={{ color: 'var(--text-primary)' }}
        />
        <Line 
          type="monotone" 
          dataKey="yes" 
          stroke="var(--yes)" 
          strokeWidth={3}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
});
MarketChart.displayName = 'MarketChart';

export default function MarketDetailModal() {
  const { activeMarketId, setActiveMarketId, openTradeSheet } = useUIStore();
  const { markets } = useAppStore();

  const market = useMemo(() => markets.find(m => m.id === activeMarketId), [markets, activeMarketId]);

  if (!market) return null;

  const showAIsignal = market.edgeScore > 60;

  return (
    <AnimatePresence>
      {activeMarketId && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-[150] bg-bg-base/95 backdrop-blur-xl overflow-y-auto"
        >
          <div className="max-w-2xl mx-auto min-h-full flex flex-col pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-bg-base/80 backdrop-blur-md border-b border-border-color">
              <div className="flex items-center gap-3">
                <Image 
                  src={`https://i.pravatar.cc/150?u=${market.id}`} 
                  alt="Creator" 
                  width={32} 
                  height={32} 
                  className="rounded-full border border-border-color" 
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-text-primary">{market.creator?.name || 'Satoshi_N'}</span>
                  <span className="text-[10px] text-text-secondary uppercase tracking-wider">Creator</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-1.5 rounded-full bg-text-primary/10 text-text-primary text-sm font-bold hover:bg-text-primary/20 transition-colors">
                  Follow
                </button>
                <button onClick={() => setActiveMarketId(null)} className="w-8 h-8 rounded-full bg-border-color/50 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-6">
              {/* Question */}
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight tracking-tight">
                {market.question}
              </h1>

              {/* Chart */}
              <div className="h-64 w-full relative bg-bg-surface rounded-2xl border border-border-color p-4">
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <div className="text-3xl font-bold text-yes">{market.yesProb.toFixed(0)}%</div>
                  <div className="text-sm font-bold text-text-secondary">YES</div>
                </div>
                <div className="mt-8 h-full">
                  {market.chartData && market.chartData.length > 0 && (
                    <MarketChart data={market.chartData} />
                  )}
                </div>
              </div>

              {/* AI Signal Box */}
              {showAIsignal && (
                <div className="rounded-2xl border border-accent/30 bg-accent/5 p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-accent font-bold">
                    <Sparkles className="w-5 h-5" />
                    <span>AI Intelligence Edge</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Edge Score</span>
                    <span className="text-text-primary font-bold">{market.edgeScore}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary text-sm">Signal</span>
                    <span className="text-text-primary font-bold">{market.mispricingSignal}</span>
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border-color bg-bg-surface p-4 flex flex-col gap-1">
                  <span className="text-text-secondary text-sm font-medium">Volume</span>
                  <span className="text-text-primary font-bold text-lg">${(market.volume || 0).toLocaleString()}</span>
                </div>
                <div className="rounded-2xl border border-border-color bg-bg-surface p-4 flex flex-col gap-1">
                  <span className="text-text-secondary text-sm font-medium">Liquidity</span>
                  <span className="text-text-primary font-bold text-lg">${((market.volume || 0) * 0.4).toLocaleString()}</span>
                </div>
              </div>

              {/* Order Book & History (Mocked for now) */}
              <div className="rounded-2xl border border-border-color bg-bg-surface p-4 flex flex-col gap-4">
                <h3 className="font-bold text-text-primary flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" /> Order Book
                </h3>
                <div className="flex justify-between text-sm">
                  <div className="flex flex-col gap-2 w-[48%]">
                    <div className="flex justify-between text-text-secondary text-xs"><span>Price</span><span>Size</span></div>
                    <div className="flex justify-between text-yes"><span>{market.yesProb}¢</span><span>$1,240</span></div>
                    <div className="flex justify-between text-yes/80"><span>{market.yesProb - 1}¢</span><span>$850</span></div>
                    <div className="flex justify-between text-yes/60"><span>{market.yesProb - 2}¢</span><span>$3,100</span></div>
                  </div>
                  <div className="flex flex-col gap-2 w-[48%]">
                    <div className="flex justify-between text-text-secondary text-xs"><span>Price</span><span>Size</span></div>
                    <div className="flex justify-between text-no"><span>{100 - market.yesProb}¢</span><span>$920</span></div>
                    <div className="flex justify-between text-no/80"><span>{100 - market.yesProb - 1}¢</span><span>$1,400</span></div>
                    <div className="flex justify-between text-no/60"><span>{100 - market.yesProb - 2}¢</span><span>$2,200</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Trading Bar */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-bg-base/90 backdrop-blur-md border-t border-border-color z-20">
            <div className="max-w-2xl mx-auto flex gap-3">
              <button 
                onClick={() => openTradeSheet(market.id, 'YES')}
                className="flex-1 h-14 rounded-xl bg-yes text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Buy YES {(market.yesProb).toFixed(0)}¢
              </button>
              <button 
                onClick={() => openTradeSheet(market.id, 'NO')}
                className="flex-1 h-14 rounded-xl bg-no text-white font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                Buy NO {(100 - market.yesProb).toFixed(0)}¢
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
