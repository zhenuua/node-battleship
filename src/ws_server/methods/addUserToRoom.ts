import { WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { db } from "../connectWSS";
import { sendWSResponse } from "../../utils";

export const addUserToRoom = (ws: WebSocket, currentPlayer: Player, request: IFrame) => {
  const data = JSON.parse(request.data);
  db.addPlayerToRoom(data?.indexRoom, currentPlayer);
  
  sendWSResponse(
    EVENTS.CREATE_GAME,
    {
      idGame: data?.indexRoom,
      idPlayer: currentPlayer.id,
    },
    ws
  )

  sendWSResponse(
    EVENTS.UPDATE_ROOM,
    db.getRoomsForResp(),
    ws,
  )
}