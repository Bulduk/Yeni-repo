export class SocketClient {
  private ws: WebSocket | null = null;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect() {
    this.ws = new WebSocket(this.url);
    
    this.ws.onopen = () => {
      console.log('Connected to WS');
    };

    this.ws.onmessage = (event) => {
      // Handle incoming messages
    };
  }

  subscribe(channel: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'SUBSCRIBE', channel }));
    }
  }

  disconnect() {
    this.ws?.close();
  }
}

export const socketClient = new SocketClient(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
