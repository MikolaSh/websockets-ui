import { Room } from "../models/room.model.ts";
import { Game } from "../models/game.model.ts";
import { WebSocket } from "ws";
import { generateId } from "../utils.ts";

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
    // Отправляем первому игроку
    game.player1.ws.send(JSON.stringify({
      type: "create_game",
      data: JSON.stringify({
        idGame: game.id,
        idPlayer: game.player1.playerId
      }),
      id: 0
    }));

    // Отправляем второму игроку
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

}