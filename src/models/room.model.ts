import { WebSocket } from "ws";
import { PlayerInRoom } from "../types/room.ts";
import { User } from "./user.model";

export class Room {
  constructor(
    public id: string,
    public name: string,
    public players: Array<PlayerInRoom> = [],
    public createdAt: Date = new Date(),
  ) {}

  addPlayer(user: User, ws: WebSocket): void {
    if (this.players.length >= 2) {
      throw new Error('Room is full');
    }
    this.players.push({ user, ws });
  }
}