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
      const game = this.gameService.getGameByPlayerWs(ws);
      if (!game) throw new Error('Game not found');

      const player = game.getPlayerById(message.data.indexPlayer);
      if (!player) throw new Error('Player not found in this game');

      // Сохраняем корабли
      player.ships = message.data.ships;

      // Проверяем готовность обоих игроков
      if (game.player1.ships && game.player2.ships) {
        game.status = 'ready';
        this.startGame(game);
      }

    } catch (error) {
      this.gameView.sendError(ws, error instanceof Error ? error.message : 'Invalid ships data');
    }
  }

  private startGame(game: Game) {
    game.status = 'started';
    // Логика начала игры (отправка turn и т.д.)
  }
}