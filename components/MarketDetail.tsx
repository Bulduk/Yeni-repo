'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore, Market } from '@/lib/store';
import { ArrowLeft, TrendingUp, Clock, AlertTriangle, Info, Activity } from 'lucide-react';
import Image from 'next/image';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

export default function MarketDetail({ id }: { id: string }) {
  const router = useRouter();
  const { markets, setMarkets } = useAppStore();
  const [tradeType, setTradeType] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState('');

  const market = markets.find(m => m.id === id);

  useEffect(() => {
    if (!market) {
      // Fetch if not in store
      fetch('/api/markets')
        .then(res => res.json())
        .then(data => {
          setMarkets(data.markets);
        });
    }
  }, [id, market, setMarkets]);

  if (!market) {
    return <div className="h-[100dvh] w-full flex items-center justify-center bg-bg-base text-text-primary">Loading...</div>;
  }

  return (
    <div className="min-h-[100dvh] w-full bg-bg-base flex flex-col text-text-primary font-sans">
      {/* Header */}
      <div className="pt-[calc(env(safe-area-inset-top,1rem)+0.5rem)] px-4 pb-4 bg-bg-surface border-b border-border-color sticky top-0 z-10 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-bg-base rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-sm font-bold truncate flex-1">{market.question}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Market Info */}
        <div className="p-4 bg-bg-surface border-b border-border-color">
          <div className="flex items-center gap-3 mb-4">
            <Image 
              src={`https://i.pravatar.cc/150?u=${market.id}`} 
              alt="Creator" 
              width={32} 
              height={32} 
              className="rounded-full border border-border-color" 
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-text-secondary font-bold tracking-wider uppercase">CREATED BY</span>
              <span className="text-sm font-bold">{market.creator.name}</span>
            </div>
          </div>
          
          <h2 className="text-xl font-bold leading-snug mb-4">{market.question}</h2>
          
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-1.5 text-[var(--color-yes)]">
              <TrendingUp className="w-4 h-4" />
              {market.yesProb.toFixed(0)}% YES
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Activity className="w-4 h-4" />
              ${(market.volume / 1000).toFixed(1)}k Vol
            </div>
            <div className="flex items-center gap-1.5 text-text-secondary">
              <Clock className="w-4 h-4" />
              {market.timeLeft}
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="p-4 bg-bg-surface border-b border-border-color">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={market.chartData}>
                <YAxis domain={[0, 100]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: 'var(--color-text-primary)' }}
                  formatter={(value: any) => [`${Number(value).toFixed(0)}%`, 'Probability']}
                  labelStyle={{ display: 'none' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--color-yes)" 
                  strokeWidth={3} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Edge / Intelligence */}
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary">Market Intelligence</h3>
          
          <div className="bg-bg-surface border border-border-color rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[var(--color-accent)]" />
                <span className="font-bold text-sm">AI Edge Score</span>
              </div>
              <span className="font-bold text-[var(--color-accent)]">{market.edgeScore}/100</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              {market.mispricingSignal}
            </p>
          </div>

          {market.whaleActivity && (
            <div className="bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4 text-[var(--color-accent)]" />
              </div>
              <div>
                <span className="font-bold text-sm text-[var(--color-accent)] block">Whale Activity Detected</span>
                <span className="text-xs text-text-secondary">Large accumulation of YES shares in the last hour.</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trade Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-bg-surface border-t border-border-color p-4 pb-[calc(env(safe-area-inset-bottom,1rem)+1rem)] z-20">
        <div className="flex gap-2 mb-3">
          <button 
            onClick={() => setTradeType('YES')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors ${tradeType === 'YES' ? 'bg-[var(--color-yes)] text-[var(--color-bg-base)]' : 'bg-bg-base border border-border-color text-text-secondary'}`}
          >
            Buy YES {market.yesProb.toFixed(0)}¢
          </button>
          <button 
            onClick={() => setTradeType('NO')}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors ${tradeType === 'NO' ? 'bg-[var(--color-no)] text-[var(--color-bg-base)]' : 'bg-bg-base border border-border-color text-text-secondary'}`}
          >
            Buy NO {(100 - market.yesProb).toFixed(0)}¢
          </button>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary font-bold">$</span>
            <input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-bg-base border border-border-color rounded-lg py-2.5 pl-7 pr-3 text-sm font-bold focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </div>
          <button className="bg-text-primary text-bg-base px-6 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
            Review
          </button>
        </div>
      </div>
    </div>
  );
}
