import { eventBus } from '../events/eventBus';
import { EventType } from '../events/eventTypes';

export class PriceEngine {
  calculateProbability(yesVolume: number, totalVolume: number): number {
    if (totalVolume === 0) return 50; // Default AMM fallback
    return (yesVolume / totalVolume) * 100;
  }

  async updateMarketPrice(marketId: string, yesVolume: number, totalVolume: number) {
    const yesProb = this.calculateProbability(yesVolume, totalVolume);
    const noProb = 100 - yesProb;

    // Update DB

    // Emit event
    eventBus.publish({
      type: EventType.PRICE_UPDATED,
      payload: {
        marketId,
        yesProb,
        noProb,
        timestamp: Date.now(),
      }
    });
  }
}

export const priceEngine = new PriceEngine();
