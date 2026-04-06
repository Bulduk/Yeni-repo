import { create } from 'zustand';

interface UIState {
  activeMarketId: string | null;
  setActiveMarketId: (id: string | null) => void;
  tradeSheetOpen: boolean;
  setTradeSheetOpen: (open: boolean) => void;
  tradeMarketId: string | null;
  tradeType: 'YES' | 'NO' | null;
  openTradeSheet: (marketId: string, type: 'YES' | 'NO') => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeMarketId: null,
  setActiveMarketId: (id) => set({ activeMarketId: id }),
  tradeSheetOpen: false,
  setTradeSheetOpen: (open) => set({ tradeSheetOpen: open }),
  tradeMarketId: null,
  tradeType: null,
  openTradeSheet: (marketId, type) => set({ tradeSheetOpen: true, tradeMarketId: marketId, tradeType: type }),
}));
