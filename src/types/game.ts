import { WebSocket } from "ws";

export type CreateGameResponse = {
  type: 'create_game';
  data: {
    idGame: string | number;
    idPlayer: string | number; // Уникальный ID игрока в этой сессии
  };
  id: 0;
};

export type Game = {
  id: string;
  players: Array<Player>;
  status: 'waiting_ships' | 'ready' | 'started';
};

export type Player = {
  ws: WebSocket;
  userId: string;
  playerId: string;
  ships?: Ship[];
}

export type Ship = {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};

export type AddShipsRequestData = {
  gameId: string | number;
  ships: Ship[];
  indexPlayer: string;
};