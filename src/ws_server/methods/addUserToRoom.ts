import { RawData, WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { Game } from "../modules/Game";
import { db } from "../connectWSS";
import { Room } from "../modules/Room";
import { sendWSResponse } from "../../utils";

export const addUserToRoom = (ws: WebSocket, currentPlayer: Player, request: IFrame) => {

  // const game = new Game();
  // db.addGame(game);
  // const room = new Room(currentPlayer);
  // db.addRoom(room);
  sendWSResponse(
    EVENTS.CREATE_GAME,
    {
      idGame: 1,
      idPlayer: currentPlayer.id,
    },
    ws
  )
}