import WebSocket, { RawData } from "ws";
import { IFrame } from "../types";
import { EVENTS } from "../constants";
import { reg } from "./methods/reg";
import { Player } from "./modules/Player";
import { DB } from "../DB";
import { create } from "./methods/create";
import { addUserToRoom } from "./methods/addUserToRoom";
import { addShips } from "./methods/addShips";
import { attack } from "./methods/attack";

export const db = new DB();

export const connectWSS = (ws: WebSocket) => {
  let currentPlayer: Player;
  ws.on('error', console.error);
  ws.on('message', (data: RawData) => {
    const request = JSON.parse(data.toString()) as IFrame;
    switch (request.type) {
      case EVENTS.REG:
        const player = reg(ws, request)
        currentPlayer = player;
        break;
      case EVENTS.CREATE_ROOM:
        create(ws, currentPlayer, request)
        break;

      case EVENTS.ADD_USER_TO_ROOM:
        addUserToRoom(ws, currentPlayer, request)
        break;
      case EVENTS.ADD_SHIPS:
        addShips(ws, currentPlayer, request)
        break;
      case EVENTS.ATTACK:
        attack(request)
        break;
      case EVENTS.RANDOM_ATTACK:
        // attack(request, true)
        break;
      default:
        console.log(request);
    }
  });
};