import { EventEmitter } from 'events';
import { EventType, AppEvent } from './eventTypes';

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    // Increase max listeners if needed for many websocket connections
    this.setMaxListeners(100);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public publish<T extends EventType>(event: AppEvent<T>): void {
    this.emit(event.type, event.payload);
  }

  public subscribe<T extends EventType>(
    type: T,
    callback: (payload: AppEvent<T>['payload']) => void
  ): () => void {
    this.on(type, callback);
    return () => this.off(type, callback);
  }
}

export const eventBus = EventBus.getInstance();
