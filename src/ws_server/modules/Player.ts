import crypto from "crypto";
import { WebSocket } from "ws";

export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean = false;
  errorText: string = '';
  ships: [] = [];
  ws: WebSocket;

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = crypto.randomUUID();
    this.ws = ws;
  }
}