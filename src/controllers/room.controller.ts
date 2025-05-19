import { WebSocket } from "ws";
import { ConnectionService } from "../services/connection.sercive.ts";
import { RoomService } from "../services/room.service.ts";
import { RoomView } from "../view/room.view.ts";

export class RoomController {
  private connectionService: ConnectionService;
  private roomService: RoomService;
  private roomView: RoomView;

  constructor(roomService: RoomService, connectionService: ConnectionService, roomView: RoomView) {
    this.roomService = roomService;
    this.connectionService = connectionService;
    this.roomView = roomView;
  }

  async handleCreateRoom(ws: WebSocket) {
    const user = this.connectionService.getUserFromSocket(ws);
    console.log(user);
  }
}