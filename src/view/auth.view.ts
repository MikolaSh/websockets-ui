import { User } from '../models/user.model.ts';
import { LoginResponse } from '../types/login.ts';
import { WebSocket } from 'ws';
import { BaseView } from './base.view.ts';

export class AuthView extends BaseView{
  sendSuccess(ws: WebSocket, user: User) {
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

  sendError(ws: WebSocket, error: Error) {
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