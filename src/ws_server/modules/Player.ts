import crypto from "crypto";
import { WebSocket } from "ws";
import { IShip } from "../../types";

export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean = false;
  errorText: string = '';
  ships: IShip[] = [];
  isTurn: boolean = false;
  ws: WebSocket;

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = crypto.randomUUID();
    this.ws = ws;
  }

  addShips(ships: IShip[]) {
    this.ships = ships;
  }

  changeTurn() {
    this.isTurn = !this.isTurn
  }


}