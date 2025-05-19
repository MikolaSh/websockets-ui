import { WebSocket } from 'ws';
import { User } from '../models/user.model.ts';

export class ConnectionService {
  private socketToUser = new Map<WebSocket, User>();
  private userToSocket = new Map<number, WebSocket>();

  registerConnection(user: User, ws: WebSocket) {
    this.socketToUser.set(ws, user);
    this.userToSocket.set(user.index, ws);
  }

  unregisterConnection(ws: WebSocket) {
    const user = this.socketToUser.get(ws);
    if (user) {
      this.userToSocket.delete(user.index);
    }
    this.socketToUser.delete(ws);
  }

  getUserFromSocket(ws: WebSocket): User | undefined {
    return this.socketToUser.get(ws);
  }

  getSocketForUser(userId: number): WebSocket | undefined {
    return this.userToSocket.get(userId);
  }
}