import { WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { db } from "../connectWSS";
import { sendWSResponse } from "../../utils";

export const addShips = (ws: WebSocket, currentPlayer: Player, request: IFrame) => {
  const data = JSON.parse(request.data);
  const playerId = data.indexPlayer;
  const ships = data.ships;
  const gameId = data.gameId;

  currentPlayer.addShips(ships);
  db.addShips(gameId, playerId, ships);
  if (db.isStartGame(gameId)) {
    db.getRoomPlayers(gameId).forEach(player => {
      sendWSResponse(
        EVENTS.START_GAME,
        player.ships,
        player.ws
      )
    });
  }

  sendWSResponse(
    EVENTS.UPDATE_ROOM,
    db.getRoomsForResp(),
    ws,
  )
}