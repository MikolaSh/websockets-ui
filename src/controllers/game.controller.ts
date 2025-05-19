import { WebSocket } from 'ws';
import { AddShipsRequestData } from '../types/game.ts';
import { GameService } from '../services/game.service';
import { WSRequest } from '../types';
import { GameView } from '../view/game.view.ts';
import { Game } from '../models/game.model.ts';

export class GameController {
  constructor(
    private gameService: GameService,
    private gameView: GameView
  ) {}

  handleAddShips(ws: WebSocket, message: WSRequest<AddShipsRequestData>) {
    try {
      const { gameId, ships, indexPlayer } = message.data;
      
      if (!ships || ships.length === 0) {
        throw new Error('No ships provided');
      }

      this.gameService.handleAddShips(ws, indexPlayer, ships);

    } catch (error) {
      this.gameView.sendError(ws, error instanceof Error ? error.message : 'Invalid ships data');
    }
  }
}