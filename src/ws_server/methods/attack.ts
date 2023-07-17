import { WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { db } from "../connectWSS";
import { sendWSResponse } from "../../utils";

export const attack = (request: IFrame, isRandom = false) => {
  const data = JSON.parse(request.data);
  const { x, y, gameId: roomId, indexPlayer: playerId } = data;
  const roomPlayers = db.getRoomPlayers(roomId)

  const turnUser = roomPlayers.find((p) => p.isTurn)
  if (turnUser && turnUser.id === playerId) {
    roomPlayers.forEach(player => {
      // check shot Status
      sendWSResponse(
        EVENTS.ATTACK,
        {
          position:
          {
            x: x,
            y: y,
          },
          currentPlayer: playerId,
          status: "miss",  // "miss" | "killed" | "shot"
        },
        player.ws
      )
      player.changeTurn();
    });

    const newTurnUser = roomPlayers.find((p) => p.isTurn)
    roomPlayers.forEach(player => {
      sendWSResponse(
        EVENTS.TURN,
        {
          currentPlayer: newTurnUser ? newTurnUser.id : turnUser.id,
        },
        player.ws
      )
    })
  }
}