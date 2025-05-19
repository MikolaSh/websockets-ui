import { WebSocket } from "ws";
import { Room } from "../models/room.model.ts";
import { Game } from "../models/game.model.ts";
import { generateId } from "../utils.ts";
import { Ship } from "../types/game.ts";

export class GameService {
  private games = new Map<string, Game>();
  private playerToGameMap = new Map<WebSocket, string>();

  createGame(room: Room): Game {
    const gameId = generateId();
    const player1Id = generateId();
    const player2Id = generateId();

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
      }
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
      data: {
        ships: game.player1.ships!,
        currentPlayerIndex: firstPlayerId
      },
      id: 0
    }));

    game.player2.ws.send(JSON.stringify({
      type: 'start_game',
      data: {
        ships: game.player2.ships!,
        currentPlayerIndex: firstPlayerId
      },
      id: 0
    }));
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

}