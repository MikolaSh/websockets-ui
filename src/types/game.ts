import { WebSocket } from "ws";

export type CreateGameResponse = {
  type: 'create_game';
  data: {
    idGame: string;
    idPlayer: string;
  };
  id: 0;
};
export type StartGameResponse = {
  type: 'start_game';
  data: {
    ships: Array<Ship>;
    currentPlayerIndex: string; 
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

export type TurnResponseData = {
    currentPlayer: string;
};

export type AttackRequestData = {
    gameId: string;
    x: number;
    y: number;
    indexPlayer: string;
};

export type AttackResponseData = {
    position: { x: number; y: number };
    currentPlayer: string;
    status: 'miss' | 'killed' | 'shot';
};

export type RandomAttackRequestData = {
    gameId: string;
    indexPlayer: string;
};

export type FinishResponseData = {
    winPlayer: string;
};

export type MissResult = {
  x: number;
  y: number;
  status: "miss";
};

export type HitResult = {
  x: number;
  y: number;
  status: "killed" | "shot";
};

export type Coord = {x: number, y: number}