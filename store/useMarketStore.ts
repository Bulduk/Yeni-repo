import { create } from 'zustand';

interface MarketState {
  markets: any[];
  setMarkets: (markets: any[]) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
  markets: [],
  setMarkets: (markets) => set({ markets }),
}));
