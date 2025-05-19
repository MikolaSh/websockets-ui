import { LoginRequestData } from "./types/login.ts";
import { AddPlayerRequetData } from "./types/room.ts";

type WSRequestType = "reg"
  | "update_winners"
  | "create_room"
  | "add_user_to_room"
  | "create_game"
  | "update_room"
  | "add_ships"
  | "start_game"
  | "attack" 
  | "randomAttack" 
  | "turn" 
  | "finish" 

export type WSRequest<T = any> = {
  type: WSRequestType;
  data: T;
  id: 0;
}