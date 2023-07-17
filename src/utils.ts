import { WebSocket } from "ws";

export const sendWSResponse = (type: string, data: any, ws: WebSocket,) => {
  const response = JSON.stringify({
    type: type,
    data: JSON.stringify(data),
    id: 0,
  });
  ws.send(response);
};