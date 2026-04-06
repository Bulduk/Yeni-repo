'use client';

import { useState } from 'react';
import BottomNav from './BottomNav';
import { Settings, ShieldCheck, Copy, Users, Activity, BarChart2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

export default function Profile() {
  const { portfolio } = useAppStore();
  const [activeTab, setActiveTab] = useState<'Overview' | 'Positions' | 'Activity' | 'Markets'>('Overview');

  const tabs = ['Overview', 'Positions', 'Activity', 'Markets'] as const;

  return (
    <div className="h-[100dvh] w-full bg-bg-base flex flex-col text-text-primary font-sans">
      <div className="pt-[calc(env(safe-area-inset-top,1rem)+0.5rem)] px-4 pb-4 bg-bg-surface border-b border-border-color shrink-0 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <button className="p-2 hover:bg-bg-base rounded-full transition-colors">
          <Settings className="w-5 h-5 text-text-secondary" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {/* Top Section */}
        <div className="p-6 bg-bg-surface border-b border-border-color flex flex-col items-center">
          <Image 
            src="https://i.pravatar.cc/150?u=current_user" 
            alt="Profile" 
            width={80} 
            height={80} 
            className="rounded-full border-2 border-border-color mb-3" 
            referrerPolicy="no-referrer"
          />
          <h2 className="text-2xl font-bold mb-1">Satoshi_N</h2>
          
          <div className="flex items-center gap-4 text-sm font-medium mb-6">
            <div className="flex items-center gap-1 text-text-secondary">
              <ShieldCheck className="w-4 h-4 text-yes" />
              <span>Trust Score: 98</span>
            </div>
            <div className="flex items-center gap-1 text-text-secondary">
              <Users className="w-4 h-4" />
              <span>1.2K Followers</span>
            </div>
          </div>

          <div className="flex gap-3 w-full max-w-sm">
            <button className="flex-1 py-2.5 rounded-xl bg-text-primary text-bg-base font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <Users className="w-4 h-4" /> Follow
            </button>
            <button className="flex-1 py-2.5 rounded-xl border border-border-color bg-bg-base font-bold flex items-center justify-center gap-2 hover:bg-text-primary/5 transition-colors">
              <Copy className="w-4 h-4" /> Copy Trade
            </button>
          </div>
        </div>

        {/* PnL Stats */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <div className="bg-bg-surface border border-border-color rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Total Balance</span>
            <span className="text-2xl font-bold">${portfolio?.balance.toFixed(2) || '0.00'}</span>
          </div>
          <div className="bg-bg-surface border border-border-color rounded-2xl p-4 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">All Time PnL</span>
            <span className="text-2xl font-bold text-yes flex items-center gap-1">
              <ArrowUpRight className="w-5 h-5" />
              ${portfolio?.totalProfit.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 border-b border-border-color flex gap-6 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 font-bold text-sm whitespace-nowrap transition-colors relative ${
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

        {/* Tab Content */}
        <div className="p-4">
          {activeTab === 'Positions' && (
            <div className="space-y-3">
              {portfolio?.positions.length === 0 ? (
                <div className="text-center text-text-secondary py-8">No active positions</div>
              ) : (
                portfolio?.positions.map((pos, i) => (
                  <div key={i} className="bg-bg-surface border border-border-color rounded-xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-sm line-clamp-2">Market {pos.marketId}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-bold ${pos.type === 'YES' ? 'bg-yes/10 text-yes' : 'bg-no/10 text-no'}`}>
                        {pos.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-text-secondary mb-1">Shares</p>
                        <p className="font-bold">{pos.shares}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-secondary mb-1">Avg Price</p>
                        <p className="font-bold">{pos.avgPrice}¢</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-text-secondary mb-1">Value</p>
                        <p className="font-bold">${((pos.shares * pos.avgPrice) / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Overview' && (
             <div className="text-center text-text-secondary py-8">Overview stats coming soon</div>
          )}
          {activeTab === 'Activity' && (
             <div className="text-center text-text-secondary py-8">Recent activity coming soon</div>
          )}
          {activeTab === 'Markets' && (
             <div className="text-center text-text-secondary py-8">Created markets coming soon</div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
