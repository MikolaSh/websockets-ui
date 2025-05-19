import { WebSocket } from 'ws';
import { AuthController } from '../controllers/auth.controller.ts';
import { RoomController } from '../controllers/room.controller.ts';
import { deepParseJson } from '../utils.ts';
import { WSRequest } from '../types.ts';
import { GameController } from 'src/controllers/game.controller.ts';

export class WSRouter {
  constructor(
    private authController: AuthController,
    private roomController: RoomController,
    private gameController: GameController
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
            this.roomController.handleCreateRoom(ws);
            break;
          case 'add_user_to_room':
            this.roomController.handleAddUserToRoom(ws, message);
            break;
          case 'add_ships':
            this.gameController.handleAddShips(ws, message);
            break;
          case 'attack':
            this.gameController.handleAttack(ws, message);
            break;
          case 'randomAttack':
            this.gameController.handleRandomAttack(ws, message);
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