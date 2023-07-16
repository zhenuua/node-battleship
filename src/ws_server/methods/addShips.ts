import { WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { db } from "../connectWSS";
import { sendWSResponse } from "../../utils";

export const addShips = (ws: WebSocket, currentPlayer: Player, request: IFrame) => {
  const data = JSON.parse(request.data);
  const { ships, gameId: roomId, indexPlayer: playerId } = data;

  currentPlayer.addShips(ships);

  const roomPlayers = db.getRoomPlayers(roomId)
  const firstPlayer = roomPlayers[0];

  db.addShips(roomId, playerId, ships);

  if (db.isStartGame(roomId)) {
    firstPlayer.changeTurn();
    roomPlayers.forEach(player => {
      sendWSResponse(
        EVENTS.START_GAME,
        player.ships,
        player.ws
      )
      sendWSResponse(
        EVENTS.TURN,
        {
          currentPlayer: firstPlayer.id,
        },
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