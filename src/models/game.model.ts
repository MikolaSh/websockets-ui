import { Player } from "../types/game.ts";

export class Game {
  constructor(
    public id: string,
    public player1: Player,
    public player2: Player,
    public status: 'waiting_ships' | 'ready' | 'started' = 'waiting_ships'
  ) {}

  getPlayerById(playerId: string) {
    return this.player1.playerId === playerId ? this.player1 : 
           this.player2.playerId === playerId ? this.player2 : null;
  }
}