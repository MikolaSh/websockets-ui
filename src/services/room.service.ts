import { Room } from "../models/room.model.ts";
import { RoomRepository } from "../models/room.repository.ts";
import { User } from "../models/user.model.ts";
import { WebSocket } from "ws";
import { GameService } from "./game.service.ts";

export class RoomService {
  constructor(
    private roomRepo = new RoomRepository(),
    private gameService: GameService
  ) {}
  
  async createRoom(name: string, creator: User, ws: WebSocket): Promise<Room> {
    return new Promise((resolve, reject) => {
      if(!name.toString().trim()) {
        reject('Name cannot be empty')
      }
      const newRoom = this.roomRepo.createRoom(name, creator, ws)
      resolve(newRoom)
    })
  }
  
  joinRoom(roomId: string, user: User, ws: WebSocket): Room {
    const room = this.roomRepo.getRoomById(roomId);
    if(!room) {
      throw new Error('Room cannot be found');
    }

    room.addPlayer(user, ws);


    if (room.players.length === 2) {
      const game = this.gameService.createGame(room);
      this.gameService.sendCreateGameNotifications(game);
      this.roomRepo.deleteRoom(room.id);
    }

    return room;
  }

  getAvailableRooms(): Array<Room> {
    const rooms = this.roomRepo.getAllRooms();


    return rooms.map((room) => {
      if(room.players.length < 2) {
        return room;
      }
    }).filter((room) => room !== undefined)
  }
}