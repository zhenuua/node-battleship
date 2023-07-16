import crypto from "crypto";
import { Player } from "./Player";

export class Game {
  id: string;
  ships: any[] = [];
  players: Player[] = [];

  constructor(gameId: string) {
    this.id = gameId;
  }
}