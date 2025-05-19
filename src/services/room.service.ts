import { Room } from "../models/room.model.ts";
import { RoomRepository } from "../models/room.repository.ts";
import { User } from "../models/user.model.ts";
import { WebSocket } from "ws";

export class RoomService {
  constructor(private roomRepo = new RoomRepository()) {}
  
  createRoom(name: string, creator: User, ws: WebSocket): Room {
    if(!name.trim()) {
      throw new Error('Name cannot be empty');
    }
    return this.roomRepo.createRoom(name, creator, ws)
  }
  
  joinRoom(roomId: string, user: User, ws: WebSocket): Room {
    const room = this.roomRepo.getRoomById(roomId);
    if(!room) {
      throw new Error('Room cannot be found');
    }

    room.addPlayer(user, ws);
    return room;
  }

  getAvailableRooms(): Array<Room> {
    const rooms = this.roomRepo.getAllRooms();
    return rooms.map((room) => {
      if(!room.players.length) {
        return room;
      }
    }).filter((room) => room !== undefined)
  }
}