import crypto from "crypto";
import { Player } from "./Player";

export class Game {
  id: string = crypto.randomUUID();
  ships: any[] = [];
  players: Player[] = [];
}