import { Room } from "src/models/room.model.ts";
import { WebSocket } from "ws";
import { BaseView } from "./base.view.ts";

export class RoomView extends BaseView  {

  sendRoomUpdate(ws: WebSocket, rooms: Array<Room>) {
    const response = this.prepareRoomUpdate(rooms);
    ws.send(JSON.stringify(response));
  }

  broadcastRoomUpdate(rooms: Array<Room>) {
    const response = this.prepareRoomUpdate(rooms);
    this.broadcast(response);
  }

  private prepareRoomUpdate(rooms: Array<Room>) {
    return {
      type: 'update_room',
      data: rooms.map(room => ({
        roomId: room.id,
        roomUsers: room.players.map(player => ({
          name: player.user.name,
          index: player.user.index
        }))
      })),
      id: 0
    };
  }
}