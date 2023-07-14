import crypto from "crypto";
import { Player } from "./Player";


export class Room {
  id = crypto.randomUUID();
  players: Player[] = [];
  constructor(firstPlayer: Player) {
    this.players.push(firstPlayer);
  }

  updateRooms() {
  }

  addPlayer(player: Player) {
    this.players.push(player);
  }
}