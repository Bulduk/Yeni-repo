import { create } from 'zustand';

export type Market = {
  id: string;
  question: string;
  category: string;
  creator: {
    name: string;
    avatar: string;
    followers: number;
  };
  yesProb: number;
  chartData: { time: string; price: number }[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  aiPrediction: number;
  timeLeft: string;
  whaleActivity: boolean;
  edgeScore: number;
  mispricingSignal: string;
  volume: number;
  copyCount: number;
};

type Portfolio = {
  balance: number;
  positions: any[];
  totalProfit: number;
};

interface AppState {
  markets: Market[];
  portfolio: Portfolio | null;
  setMarkets: (markets: Market[]) => void;
  updateMarketPrice: (marketId: string, newPrice: number) => void;
  setPortfolio: (portfolio: Portfolio) => void;
  executeTrade: (marketId: string, type: 'YES' | 'NO', amount: number, price: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  markets: [],
  portfolio: null,
  setMarkets: (markets) => set({ markets }),
  updateMarketPrice: (marketId, newPrice) => set((state) => ({
    markets: state.markets.map(m => {
      if (m.id === marketId) {
        const newChartData = [...m.chartData.slice(1), { time: Date.now().toString(), price: newPrice }];
        return { ...m, yesProb: newPrice, chartData: newChartData };
      }
      return m;
    })
  })),
  setPortfolio: (portfolio) => set({ portfolio }),
  executeTrade: (marketId, type, amount, price) => set((state) => {
    if (!state.portfolio) return state;
    const cost = (amount * price) / 100;
    return {
      portfolio: {
        ...state.portfolio,
        balance: state.portfolio.balance - cost,
        positions: [
          ...state.portfolio.positions,
          { marketId, type, shares: amount, avgPrice: price }
        ]
      }
    };
  }),
}));
