import { eventBus } from '../events/eventBus';
import { EventType } from '../events/eventTypes';
import { matchingEngine } from '../engine/matchingEngine';

export class TradeService {
  async executeTrade(userId: string, marketId: string, type: 'YES' | 'NO', amount: number) {
    // 1. Validate user balance
    // 2. Call matching engine
    // 3. Write to DB (transaction)
    // 4. Emit event
  }
}

export const tradeService = new TradeService();
