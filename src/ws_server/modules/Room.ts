import crypto from "crypto";
import { Player } from "./Player";


export class Room {
  id = crypto.randomUUID();
  players: Player[] = [];

  addPlayer(player: Player) {
    this.players.push(player);
  }
}