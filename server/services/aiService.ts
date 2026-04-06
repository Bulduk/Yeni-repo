import { analyzeWithOpenClaw, OpenClawInput, AIAnalysisResult } from './openclawAdapter';
import { eventBus } from '../events/eventBus';
import { EventType } from '../events/eventTypes';

// Cache to store last result and timestamp
interface CacheEntry {
  result: AIAnalysisResult;
  lastUpdated: number;
}

const analysisCache = new Map<string, CacheEntry>();
const ANALYSIS_COOLDOWN_MS = 15000; // 15 seconds max

export class AiService {
  async analyzeMarket(marketData: OpenClawInput): Promise<AIAnalysisResult> {
    const now = Date.now();
    const cached = analysisCache.get(marketData.marketId);

    // Return cached if within cooldown
    if (cached && (now - cached.lastUpdated < ANALYSIS_COOLDOWN_MS)) {
      return cached.result;
    }

    // Otherwise, call OpenClaw
    const result = await analyzeWithOpenClaw(marketData);

    // Update cache
    analysisCache.set(marketData.marketId, {
      result,
      lastUpdated: Date.now()
    });

    // Emit event so the rest of the system knows AI updated its signals
    // Do not block trade execution, so this is emitted asynchronously
    eventBus.emit(EventType.AI_SIGNAL_UPDATED, {
      marketId: marketData.marketId,
      signal: result,
      timestamp: Date.now()
    });

    return result;
  }

  getMarketSignal(marketId: string): AIAnalysisResult | null {
    const cached = analysisCache.get(marketId);
    return cached ? cached.result : null;
  }
}

export const aiService = new AiService();

// Setup listeners to trigger AI analysis asynchronously
export function setupAIEngine() {
  // Trigger after trade execution
  eventBus.on(EventType.TRADE_EXECUTED, (payload) => {
    // We need to fetch full market data here.
    // For the engine, we mock the input based on payload and defaults.
    // In a fully integrated system, we'd pull from marketService.
    const mockData: OpenClawInput = {
      marketId: payload.marketId,
      question: "Market Question", // Placeholder
      currentPrice: payload.price,
      yesVolume: payload.amount, // Placeholder
      noVolume: 0,
      volume: payload.amount,
      liquidity: 1000,
      priceHistory: [],
      recentTrades: [],
      timeLeft: 86400
    };
    
    // Fire and forget
    aiService.analyzeMarket(mockData).catch(console.error);
  });

  // Trigger after price update
  eventBus.on(EventType.PRICE_UPDATED, (payload) => {
    const mockData: OpenClawInput = {
      marketId: payload.marketId,
      question: "Market Question", // Placeholder
      currentPrice: payload.yesProb,
      yesVolume: 1000,
      noVolume: 1000,
      volume: 2000,
      liquidity: 500,
      priceHistory: [],
      recentTrades: [],
      timeLeft: 86400
    };
    
    // Fire and forget
    aiService.analyzeMarket(mockData).catch(console.error);
  });
}

