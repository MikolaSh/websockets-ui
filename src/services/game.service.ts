import { WebSocket } from "ws";
import { Room } from "../models/room.model.ts";
import { Game } from "../models/game.model.ts";
import { generateId } from "../utils.ts";
import { AttackRequestData, Coord, HitResult, MissResult, Ship } from "../types/game.ts";
import { WSRequest } from "../types.ts";
import { WinnersView } from "../view/winners.view.ts";
import { UserRepository } from "../models/user.repository.ts";

export class GameService {
  private games = new Map<string, Game>();
  private playerToGameMap = new Map<WebSocket, string>();

  constructor(
      private userRepo: UserRepository, 
      private winnersView: WinnersView
  ) {}

  createGame(room: Room): Game {
    const gameId = generateId();
    const player1Id = generateId();
    const player2Id = generateId();

    const firstPlayerId = Math.random() > 0.5 ? player1Id : player2Id;

    const game = new Game(
      gameId,
      {
        ws: room.players[0].ws,
        userId: room.players[0].user.index.toString(),
        playerId: player1Id
      },
      {
        ws: room.players[1].ws,
        userId: room.players[1].user.index.toString(),
        playerId: player2Id
      },
      firstPlayerId,
    );

    this.games.set(gameId, game);
    this.playerToGameMap.set(room.players[0].ws, gameId);
    this.playerToGameMap.set(room.players[1].ws, gameId);

    return game;
  }

  sendCreateGameNotifications(game: Game) {
    game.player1.ws.send(JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame: game.id,
        idPlayer: game.player1.playerId
      }),
      id: 0
    }));

    game.player2.ws.send(JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame: game.id,
        idPlayer: game.player2.playerId
      }),
      id: 0
    }));
  }

  getGameByPlayerWs(ws: WebSocket): Game | undefined {
    const gameId = this.playerToGameMap.get(ws);
    return gameId ? this.games.get(gameId) : undefined;
  }

  private startGame(game: Game) {
    game.status = 'started';
    
    const firstPlayerId = Math.random() > 0.5 
      ? game.player1.playerId 
      : game.player2.playerId;

    game.player1.ws.send(JSON.stringify({
      type: 'start_game',
      data: JSON.stringify({
        ships: game.player1.ships!,
        currentPlayerIndex: firstPlayerId
      }),
      id: 0
    }));

    game.player2.ws.send(JSON.stringify({
      type: 'start_game',
      data: JSON.stringify({
        ships: game.player2.ships!,
        currentPlayerIndex: firstPlayerId
      }),
      id: 0
    }));
    
    this.sendTurn(game);
  }

  handleAddShips(ws: WebSocket, playerId: string, ships: Array<Ship>) {
    const game = this.getGameByPlayerWs(ws);
    if (!game) throw new Error('Game not found');

    const player = game.player1.playerId === playerId 
      ? game.player1 
      : game.player2.playerId === playerId 
        ? game.player2 
        : null;

    if (!player) throw new Error('Player not found in this game');

    player.ships = ships;

    if (game.areBothPlayersReady()) {
      this.startGame(game);
    }
  }

  private sendTurn(game: Game) {
    const response = {
      type: 'turn',
      data: JSON.stringify({ currentPlayer: game.currentPlayer }),
      id: 0
    };

    game.player1.ws.send(JSON.stringify(response));
    game.player2.ws.send(JSON.stringify(response));
  }

  handleAttack(ws: WebSocket, message: WSRequest<AttackRequestData>) {
    const game = this.getGameByPlayerWs(ws);
    if (!game) throw new Error('Game not found');

    const { x, y, indexPlayer } = message.data;

    if (game.currentPlayer !== indexPlayer) {
      throw new Error('Not your turn');
    }

    if (game.wasAttacked(indexPlayer, x, y)) {
      throw new Error('Already attacked this position');
    }

    game.recordAttack(indexPlayer, x, y);

    const result = this.checkAttackResult(game, indexPlayer, x, y);
    
    this.sendAttackResult(game, result);

    const winner = game.checkWinCondition();
    if (winner) {
      this.finishGame(game, winner);
      return;
    }

    if (result.status === 'miss') {
      game.switchPlayer();
    }

    this.sendTurn(game);
  }

  private sendAttackResult(game: Game, result: MissResult | HitResult) {
    const response = {
      type: 'attack',
      data: JSON.stringify({
        position: { x: result.x, y: result.y },
        currentPlayer: game.currentPlayer,
        status: result.status
      }),
      id: 0
    };
    game.player1.ws.send(JSON.stringify(response));
    game.player2.ws.send(JSON.stringify(response));
  }
  
  private checkAttackResult(game: Game, attackerId: string, x: number, y: number): MissResult | HitResult {
    const opponent = game.getOpponent(attackerId);
    if (!opponent || !opponent.ships) throw new Error('Opponent data not found');
  
    const shipAtPosition = opponent.ships.find(ship => {
      const shipCells = this.getShipCells(ship);
      return shipCells.some(cell => cell.x === x && cell.y === y);
    });
  
    if (!shipAtPosition) {
      return { x, y, status: 'miss' as const };
    }
  
    const shipCells = this.getShipCells(shipAtPosition);
    const attackedCells = game.attacks.get(attackerId) || new Set();
  
    const isKilled = shipCells.every(cell => 
      attackedCells.has(`${cell.x},${cell.y}`)
    );
  
    return { 
      x, 
      y, 
      status: isKilled ? 'killed' as const : 'shot' as const 
    };
  }
  
  private getShipCells(ship: Ship): Array<Coord> {
    const cells = [];
    const { position, direction, length } = ship;
    const { x, y } = position;
  
    for (let i = 0; i < length; i++) {
      cells.push({
        x: direction ? x : x + i,
        y: direction ? y + i : y
      });
    }
  
    return cells;
  }

  async finishGame(game: Game, winnerId: string) {
    const winner = game.player1.playerId === winnerId ? game.player1 : game.player2;
    
    await this.userRepo.incrementWins(winner.userId);

    const response = {
      type: 'finish',
      data: JSON.stringify({ winPlayer: winnerId }),
      id: 0
    };

    game.player1.ws.send(JSON.stringify(response));
    game.player2.ws.send(JSON.stringify(response));

    const winners = await this.userRepo.getWinners();
    this.winnersView.broadcastWinnersUpdate(winners);

    this.cleanupGame(game);
  }

  private cleanupGame(game: Game) {
    this.games.delete(game.id);
    this.playerToGameMap.delete(game.player1.ws);
    this.playerToGameMap.delete(game.player2.ws);
  }


}