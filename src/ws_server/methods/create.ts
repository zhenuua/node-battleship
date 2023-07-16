import { WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { db } from "../connectWSS";
import { Room } from "../modules/Room";
import { sendWSResponse } from "../../utils";

export const create = (ws: WebSocket, currentPlayer: Player, request: IFrame) => {
  const room = new Room();
  room.addPlayer(currentPlayer);
  db.addRoom(room);

  sendWSResponse(
    EVENTS.CREATE_GAME,
    {
      idGame: room.id,
      idPlayer: currentPlayer.id,
    },
    ws
  )
}