import { RawData, WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { Game } from "../modules/Game";
import { db } from "../connectWSS";
import { Room } from "../modules/Room";
import { sendWSResponse } from "../../utils";

export const create = (ws: WebSocket, currentPlayer: Player, request: IFrame) => {
  const room = new Room();
  room.addPlayer(currentPlayer);
  db.addRoom(room);

  const game = new Game(room.id);
  db.addGame(game);

  sendWSResponse(
    EVENTS.CREATE_GAME,
    {
      idGame: game.id,
      idPlayer: currentPlayer.id,
    },
    ws
  )
}