import { WebSocket } from 'ws';
import { AuthController } from '../controllers/auth.controller.ts';
import { deepParseJson } from '../utils.ts';
import { WSRequest } from '../types.ts';

const authController = new AuthController();

export function setupWSRoutes(ws: WebSocket) {
  ws.on('message', (rawMessage) => {
    try {
      const messageString = typeof rawMessage === 'string' 
      ? rawMessage 
      : Buffer.from(rawMessage as ArrayBuffer).toString('utf-8');
    
    const message = deepParseJson<WSRequest>(messageString);
      
      switch (message.type) {
        case 'reg':
          authController.handleLogin(ws, message);
          break;
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'error',
        data: { errorText: 'Invalid message format' }
      }));
    }

  });
}