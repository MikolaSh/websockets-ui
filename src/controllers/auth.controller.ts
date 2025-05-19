import { WSRequest } from "../types.ts";
import { AuthService } from "../services/auth.service.ts";
import { AuthView } from "../view/auth.view.ts";
import { RoomService } from "../services/room.service.ts";
import { RoomView } from "../view/room.view.ts";
import { WinnersView } from "src/view/winners.view.ts";
import { WebSocket } from "ws";
import { ConnectionService } from "src/services/connection.sercive.ts";

export class AuthController {
  private authService: AuthService;
  private roomService: RoomService;
  private connectionService: ConnectionService;
  private authView: AuthView;
  private roomView: RoomView;
  private winnersView: WinnersView;

  constructor(
    authService: AuthService,
    roomService: RoomService,
    connectionService: ConnectionService,
    authView: AuthView,
    roomView: RoomView,
    winnersView: WinnersView
  ) {
    this.authService = authService
    this.roomService = roomService
    this.connectionService = connectionService
    this.authView = authView
    this.roomView = roomView
    this.winnersView = winnersView
  }

  async handleLogin(ws: WebSocket, message: WSRequest) {
    try {
      const user = await this.authService.loginOrRegister(
        message.data.name,
        message.data.password
      );
      this.authView.sendSuccess(ws, user);
      this.connectionService.registerConnection(user, ws);
      
      const avilableRooms = this.roomService.getAvailableRooms();
      this.roomView.sendRoomUpdate(ws, avilableRooms);

      const winners = this.authService.getWinners();
      this.winnersView.sendWinnersUpdate(ws, winners);
      
    } catch (error) {
      this.authView.sendError(ws, error as Error);
    }
  }
}