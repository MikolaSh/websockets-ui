import { WebSocketServer } from 'ws';
import { setupWSRoutes } from './routes/ws.routes.ts';

export class App {
  private wss: WebSocketServer;

  constructor() {
    this.wss = new WebSocketServer({ port: 3000 });
    this.setupRoutes();
  }

  private setupRoutes() {
    this.wss.on('connection', (ws) => {
      setupWSRoutes(ws);
    });
  }
}