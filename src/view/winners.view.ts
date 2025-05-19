import { Winner, WinnersUpdateResponse } from '../types/winners.ts';
import { BaseView } from './base.view';

export class WinnersView extends BaseView {
  sendWinnersUpdate(ws: WebSocket, winners: Array<Winner>) {
    const response = this.prepareWinnersUpdate(winners);
    ws.send(JSON.stringify(response));
  }

  broadcastWinnersUpdate(winners: Array<Winner>) {
    const response = this.prepareWinnersUpdate(winners);
    this.broadcast(response);
  }

  private prepareWinnersUpdate(winners: Array<Winner>): WinnersUpdateResponse {
    return {
      type: 'update_winners',
      data: winners,
      id: 0
    };
  }
}