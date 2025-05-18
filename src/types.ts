import { LoginRequestData } from "./types/login";

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

export type WSRequest = {
  type: WSRequestType;
  data: any | LoginRequestData;
  id: 0;
}