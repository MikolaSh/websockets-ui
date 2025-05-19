import { WebSocketServer, WebSocket } from 'ws';

export abstract class BaseView {
  constructor(protected wss: WebSocketServer) {}

  protected broadcast(message: any) {
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
}