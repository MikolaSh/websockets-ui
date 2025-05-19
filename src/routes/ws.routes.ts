import { WebSocket } from 'ws';
import { AuthController } from '../controllers/auth.controller.ts';
import { RoomController } from '../controllers/room.controller.ts';
import { deepParseJson } from '../utils.ts';
import { WSRequest } from '../types.ts';

export class WSRouter {
  constructor(
    private authController: AuthController,
    private roomController: RoomController
  ) {}

  setupRoutes(ws: WebSocket) {
    ws.on('message', (rawMessage) => {
      try {
        const messageString = typeof rawMessage === 'string' 
          ? rawMessage 
          : Buffer.from(rawMessage as ArrayBuffer).toString('utf-8');
        
        const message = deepParseJson<WSRequest>(messageString);
        
        switch (message.type) {
          case 'reg':
            this.authController.handleLogin(ws, message);
            break;
          case 'create_room':
            break;
          default:
            ws.send(JSON.stringify({
              type: 'error',
              data: { errorText: 'Unknown message type' }
            }));
        }
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          data: { 
            errorText: error instanceof Error ? error.message : 'Invalid message format' 
          }
        }));
      }
    });
  }
}