export enum EventType {
  TRADE_EXECUTED = 'TRADE_EXECUTED',
  PRICE_UPDATED = 'PRICE_UPDATED',
  MARKET_RESOLVED = 'MARKET_RESOLVED',
  AI_SIGNAL_UPDATED = 'AI_SIGNAL_UPDATED',
}

export interface TradeExecutedPayload {
  tradeId: string;
  marketId: string;
  userId: string;
  type: 'YES' | 'NO';
  amount: number;
  price: number;
  timestamp: number;
}

export interface PriceUpdatedPayload {
  marketId: string;
  yesProb: number;
  noProb: number;
  timestamp: number;
}

export interface MarketResolvedPayload {
  marketId: string;
  outcome: 'YES' | 'NO';
  resolutionPrice: number;
  timestamp: number;
}

export interface AISignalUpdatedPayload {
  marketId: string;
  signal: {
    edgeScore: number;
    direction: 'BUY_YES' | 'BUY_NO' | 'HOLD';
    confidence: number;
    fairPrice: number;
    signals: string[];
  };
  timestamp: number;
}

export type EventPayloadMap = {
  [EventType.TRADE_EXECUTED]: TradeExecutedPayload;
  [EventType.PRICE_UPDATED]: PriceUpdatedPayload;
  [EventType.MARKET_RESOLVED]: MarketResolvedPayload;
  [EventType.AI_SIGNAL_UPDATED]: AISignalUpdatedPayload;
};

export interface AppEvent<T extends EventType> {
  type: T;
  payload: EventPayloadMap[T];
}
