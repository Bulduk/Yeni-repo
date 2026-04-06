import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { eventBus } from '../events/eventBus';
import { EventType } from '../events/eventTypes';

interface Client {
  ws: WebSocket;
  userId?: string;
  subscriptions: Set<string>; // e.g., 'market:123', 'user:456'
}

export class SocketServer {
  private wss: WebSocketServer;
  private clients: Set<Client> = new Set();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.setup();
  }

  private setup() {
    this.wss.on('connection', (ws: WebSocket) => {
      const client: Client = { ws, subscriptions: new Set() };
      this.clients.add(client);

      ws.on('message', (message: string) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(client, data);
        } catch (error) {
          console.error('Invalid WS message', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(client);
      });
    });

    // Subscribe to event bus to broadcast to clients
    eventBus.subscribe(EventType.PRICE_UPDATED, (payload) => {
      this.broadcast(`market:${payload.marketId}`, {
        type: EventType.PRICE_UPDATED,
        payload,
      });
    });

    eventBus.subscribe(EventType.TRADE_EXECUTED, (payload) => {
      // Broadcast to specific market channel
      this.broadcast(`market:${payload.marketId}`, {
        type: EventType.TRADE_EXECUTED,
        payload,
      });
      // Broadcast to specific user channel
      this.broadcast(`user:${payload.userId}`, {
        type: EventType.TRADE_EXECUTED,
        payload,
      });
    });
  }

  private handleMessage(client: Client, data: any) {
    if (data.type === 'SUBSCRIBE') {
      if (data.channel) {
        client.subscriptions.add(data.channel);
      }
    } else if (data.type === 'UNSUBSCRIBE') {
      if (data.channel) {
        client.subscriptions.delete(data.channel);
      }
    } else if (data.type === 'AUTH') {
      // Handle authentication and set client.userId
      client.userId = data.userId;
    }
  }

  private broadcast(channel: string, message: any) {
    const messageStr = JSON.stringify(message);
    for (const client of this.clients) {
      if (client.subscriptions.has(channel)) {
        if (client.ws.readyState === WebSocket.OPEN) {
          client.ws.send(messageStr);
        }
      }
    }
  }
}
