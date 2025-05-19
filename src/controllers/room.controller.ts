import { WebSocket } from "ws";
import { ConnectionService } from "../services/connection.sercive.ts";
import { RoomService } from "../services/room.service.ts";
import { RoomView } from "../view/room.view.ts";
import { User } from "../models/user.model.ts";
import { Room } from "../models/room.model.ts";
import { AddPlayerRequetData } from "src/types/room.ts";
import { WSRequest } from "src/types.ts";
import { GameService } from "src/services/game.service.ts";

export class RoomController {
  private connectionService: ConnectionService;
  private gameService: GameService;
  private roomService: RoomService;
  private roomView: RoomView;

  constructor(
    roomService: RoomService, 
    connectionService: ConnectionService, 
    gameService: GameService, 
    roomView: RoomView
  ) {
    this.roomService = roomService;
    this.connectionService = connectionService;
    this.gameService = gameService;
    this.roomView = roomView;
  }

  async handleCreateRoom(ws: WebSocket) {
    try {
      const user = this.connectionService.getUserFromSocket(ws);
      
      if(!user) {
        throw new Error('User not found');
      }
      
      if(this.isUserCreatedRoom(user)) {
        return;
      }
        
      await this.roomService.createRoom(`room-${user.name}`, user, ws);
      const avilableRooms = this.roomService.getAvailableRooms();


      this.roomView.broadcastRoomUpdate(avilableRooms);

    } catch(err) {
      throw new Error('Some error appears');
    }
  }

  handleAddUserToRoom(ws: WebSocket, { data }: WSRequest<AddPlayerRequetData>) {
    
    try {
      const roomId = data.indexRoom;
      const user = this.connectionService.getUserFromSocket(ws);

      if(!user) return;

      const room = this.roomService.joinRoom(roomId, user, ws);

      const avilableRooms = this.roomService.getAvailableRooms();

      this.roomView.broadcastRoomUpdate(avilableRooms);

    } catch(err) {
      throw new Error('Some error appears');
    }
  }

  isUserCreatedRoom(user: User) {
    const rooms = this.roomService.getAvailableRooms();

    if(!rooms.length) return;

    let isCreated = false;
    const length = rooms.length;

    for(let i = 0; i < length; i++) {
      if(rooms[i].players.some((player) => player.user.index === user.index)) {
        isCreated = true;
        break;
      }
    }


    return isCreated;

  }
}