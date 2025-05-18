import { User } from 'src/models/user.model';
import { LoginResponse } from 'src/types/login';
import { WebSocket } from 'ws';

export class AuthView {
  static sendSuccess(ws: WebSocket, user: User) {
    const response: LoginResponse = {
      type: 'reg',
      data: JSON.stringify({
        name: user.name,
        index: user.index,
        error: false,
        errorText: '',
      }),
      id: 0
    };
    ws.send(JSON.stringify(response));
  }

  static sendError(ws: WebSocket, error: Error) {
    const response: LoginResponse = {
      type: 'reg',
      data: {
        name: '',
        index: 0,
        error: true,
        errorText: error.message
      },
      id: 0
    };
    ws.send(JSON.stringify(response));
  }
}