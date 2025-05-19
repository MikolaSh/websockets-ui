import { WebSocket } from 'ws';
import { AddShipsRequestData, AttackRequestData, Coord, RandomAttackRequestData } from '../types/game.ts';
import { GameService } from '../services/game.service';
import { WSRequest } from '../types.ts';
import { GameView } from '../view/game.view.ts';
import { Game } from '../models/game.model.ts';

export class GameController {
  constructor(
    private gameService: GameService,
    private gameView: GameView
  ) {}

  handleAddShips(ws: WebSocket, message: WSRequest<AddShipsRequestData>) {
    try {
      const { ships, indexPlayer } = message.data;
      
      if (!ships || ships.length === 0) {
        throw new Error('No ships provided');
      }

      this.gameService.handleAddShips(ws, indexPlayer, ships);

    } catch (error) {
      this.gameView.sendError(ws, error instanceof Error ? error.message : 'Invalid ships data');
    }
  }

  handleAttack(ws: WebSocket, message: WSRequest<AttackRequestData>) {
    try {
      this.gameService.handleAttack(ws, message);
    } catch (error) {
      this.gameView.sendError(ws, error instanceof Error ? error.message : 'Invalid attack');
    }
  }

  handleRandomAttack(ws: WebSocket, message: WSRequest<RandomAttackRequestData>) {
    try {
      const game = this.gameService.getGameByPlayerWs(ws);
      if (!game) throw new Error('Game not found');

      const randomCoords = this.generateRandomAttack(game, message.data.indexPlayer);
      
      const attackMessage: WSRequest<AttackRequestData> = {
        type: 'attack',
        data: {
          gameId: message.data.gameId,
          x: randomCoords.x,
          y: randomCoords.y,
          indexPlayer: message.data.indexPlayer
        },
        id: 0
      };

      this.handleAttack(ws, attackMessage);
    } catch (error) {
      this.gameView.sendError(ws, error instanceof Error ? error.message : 'Invalid random attack');
    }
  }

  private generateRandomAttack(game: Game, playerId: string): Coord {
    const opponent = game.getOpponent(playerId);
    if (!opponent) throw new Error('Opponent not found');
  
    const attackedCells = game.attacks.get(playerId) || new Set();
    const availableCells: {x: number, y: number}[] = [];
  
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        if (!attackedCells.has(`${x},${y}`)) {
          availableCells.push({x, y});
        }
      }
    }
  
    if (availableCells.length === 0) {
      throw new Error('No available cells to attack');
    }
  
    const randomIndex = Math.floor(Math.random() * availableCells.length);
    return availableCells[randomIndex];
  }
}