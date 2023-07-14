import { RawData, WebSocket } from "ws";
import { EVENTS } from "../../constants";
import { IFrame } from "../../types";
import { Player } from "../modules/Player";
import { db } from "../connectWSS";

export const reg = (ws: WebSocket, request: IFrame): Player => {
  const parseRegData = JSON.parse(request.data);
  const userName = parseRegData.name;
  const userPassword = parseRegData.password;
  const resp = JSON.stringify({
    type: EVENTS.REG,
    data:
      JSON.stringify({
        name: userName,
        index: 1,
        error: false,
        errorText: '',
      }),
    id: 0,
  })
  ws.send(resp);
  const player = new Player(userName, userPassword, ws);
  db.addPlayer(player);


  if (db.rooms.length) {
    ws.send(JSON.stringify({
      type: "update_room",
      data: db.getRoomsForResp(),
      id: 0,
    }))
  }


  return player;
}