import { WebSocket } from "ws";
import { User } from "../models/user.model.ts";

export type PlayerInRoom = {
  user: User;
  ws: WebSocket; 
}