import { generateId } from "src/utils";
import { Room } from "./room.model";
import { User } from "./user.model";
import { WebSocket } from "ws";

export class RoomRepository {
  private rooms: Map<string, Room> = new Map();

  createRoom(name: string, creator: User, ws: WebSocket): Room {
    const room = new Room(
      generateId(),
      name
    )
    room.addPlayer(creator, ws);
    this.rooms.set(room.id, room);
    return room;
  }

  getRoomById(id: string): Room | undefined{
    return this.rooms.get(id);
  }

}