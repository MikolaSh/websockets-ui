import { WSRequest } from "../types.ts";
import { AuthService } from "../services/auth.service.ts";
import { AuthView } from "../view/auth.view.ts";
import { WebSocket } from "ws";

export class AuthController {
  constructor(private authService = new AuthService()) {}

  async handleLogin(ws: WebSocket, message: WSRequest) {
    console.log(message)
    try {
      const user = await this.authService.loginOrRegister(
        message.data.name,
        message.data.password
      );
      AuthView.sendSuccess(ws, user);
    } catch (error) {
      AuthView.sendError(ws, error as Error);
    }
  }
}