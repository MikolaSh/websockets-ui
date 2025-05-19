import { Ship } from '../types/game.ts';
import { WebSocket } from 'ws';

export class GameView {
  sendCreateGame(ws: WebSocket, data: { idGame: string; idPlayer: number }) {
    ws.send(JSON.stringify({
      type: 'create_game',
      data: JSON.stringify(data),
      id: 0
    }));
  }

  sendStartGame(
    ws: WebSocket, 
    ships: Array<Ship>, 
    currentPlayerIndex: string
  ) {
    ws.send(JSON.stringify({
      type: 'start_game',
      data: { ships, currentPlayerIndex },
      id: 0
    }));
  }


  sendError(ws: WebSocket, errorText: string) {
    ws.send(JSON.stringify({
      type: 'error',
      data: { errorText },
      id: 0
    }));
  }
}