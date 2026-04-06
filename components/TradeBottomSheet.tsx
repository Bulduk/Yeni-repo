'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '@/lib/store';
import { useUIStore } from '@/store/uiStore';
import { X, Wallet } from 'lucide-react';

export default function TradeBottomSheet() {
  const { tradeSheetOpen, setTradeSheetOpen, tradeMarketId, tradeType } = useUIStore();
  const { markets, portfolio, executeTrade } = useAppStore();
  
  const [amount, setAmount] = useState<string>('10');
  const [isTrading, setIsTrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset amount and error when sheet opens
  useEffect(() => {
    if (tradeSheetOpen) {
      setAmount('10');
      setError(null);
    }
  }, [tradeSheetOpen]);

  const market = markets.find(m => m.id === tradeMarketId);
  if (!market || !tradeType) return null;

  const price = tradeType === 'YES' ? market.yesProb : 100 - market.yesProb;
  const numAmount = parseFloat(amount) || 0;
  const shares = numAmount > 0 ? (numAmount / (price / 100)).toFixed(2) : '0.00';
  const potentialReturn = numAmount > 0 ? (parseFloat(shares) * 1).toFixed(2) : '0.00';
  
  const balance = portfolio?.balance || 0;
  const insufficientFunds = numAmount > balance;

  const handleTrade = async () => {
    if (insufficientFunds || numAmount <= 0) return;
    
    setIsTrading(true);
    setError(null);
    try {
      const res = await fetch('/api/trade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marketId: market.id, type: tradeType, amount: numAmount, price })
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to execute trade. Please try again.');
      }
      
      executeTrade(market.id, tradeType, numAmount, price);
      setTradeSheetOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <AnimatePresence>
      {tradeSheetOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-end justify-center bg-bg-base/80 backdrop-blur-sm"
          onClick={() => setTradeSheetOpen(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-bg-surface border-t border-border-color w-full max-w-2xl rounded-t-[2rem] p-6 flex flex-col gap-6 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${tradeType === 'YES' ? 'bg-yes' : 'bg-no'}`} />
                <h3 className="text-xl font-bold text-text-primary">Buy {tradeType}</h3>
              </div>
              <button onClick={() => setTradeSheetOpen(false)} className="w-8 h-8 rounded-full bg-border-color/50 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex justify-between items-center text-sm font-medium">
              <span className="text-text-secondary">Price</span>
              <span className="text-text-primary text-lg font-bold">{price.toFixed(0)}¢</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary font-bold text-xl">$</span>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-16 bg-bg-base border border-border-color rounded-2xl pl-8 pr-4 text-2xl font-bold text-text-primary focus:outline-none focus:border-accent transition-colors"
                  placeholder="0"
                />
              </div>
              <div className="flex gap-2">
                {[10, 50, 100].map(val => (
                  <button 
                    key={val}
                    onClick={() => setAmount(val.toString())}
                    className="flex-1 py-2 rounded-xl bg-text-primary/5 border border-border-color text-text-primary font-bold hover:bg-text-primary/10 transition-colors"
                  >
                    ${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-bg-base border border-border-color">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Est. Shares</span>
                <span className="text-text-primary font-bold">{shares}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Potential Return</span>
                <span className="text-yes font-bold">${potentialReturn}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <Wallet className="w-4 h-4" />
                <span>Balance: ${balance.toFixed(2)}</span>
              </div>
              {insufficientFunds && (
                <span className="text-no font-bold">Insufficient funds</span>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-no/10 border border-no/20 text-no text-sm font-medium">
                {error}
              </div>
            )}

            <button 
              onClick={handleTrade}
              disabled={isTrading || insufficientFunds || numAmount <= 0}
              className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center transition-all ${
                insufficientFunds || numAmount <= 0
                  ? 'bg-text-primary/10 text-text-secondary cursor-not-allowed'
                  : tradeType === 'YES' 
                    ? 'bg-yes text-white hover:opacity-90' 
                    : 'bg-no text-white hover:opacity-90'
              }`}
            >
              {isTrading ? 'Confirming...' : `Confirm Buy ${tradeType}`}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
