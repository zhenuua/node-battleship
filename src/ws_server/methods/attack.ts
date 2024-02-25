import { EVENTS, SHIP } from "../../constants";
import { IFrame } from "../../types";
import { db } from "../connectWSS";
import { sendWSResponse } from "../../utils";


export const attack = (request: IFrame, isRandom = false) => {
  const data = JSON.parse(request.data);
  const { x: xAttack, y: yAttack, gameId: roomId, indexPlayer: playerId } = data;
  const roomPlayers = db.getRoomPlayers(roomId)
  let x = xAttack;
  let y = yAttack

  const turnUser = roomPlayers.find((p) => p.isTurn);
  const anotherUser = roomPlayers.find((p) => !p.isTurn);
  // if (isRandom && turnUser?.listTurns) {
  // x = 
  // y =
  // }
  if (turnUser && anotherUser && turnUser.id === playerId && turnUser.isCorrectTurn(x, y)) {
    turnUser.addNewTurn(x, y)

    let statusAttack = 'miss';
    const attackResult = turnUser.getStatusAttack(x, y, anotherUser);
    statusAttack = attackResult.status

    roomPlayers.forEach(player => {
      if (statusAttack === SHIP.KILLED && attackResult?.killedShipPositions) {
        attackResult?.killedShipPositions.forEach((position) => {
          sendWSResponse(
            EVENTS.ATTACK,
            {
              position:
              {
                x: position.x,
                y: position.y,
              },
              currentPlayer: playerId,
              status: statusAttack,
            },
            player.ws
          )
        })

        if (attackResult?.isFinishGame) {
          sendWSResponse(
            EVENTS.FINISH_GAME,
            {
              winPlayer: turnUser.id
            },
            player.ws
          )
          sendWSResponse(
            EVENTS.UPDATE_WINNERS,
            {
              name: turnUser.name,
              wins: turnUser.id
            },
            player.ws
          )
        }
      } else {
        sendWSResponse(
          EVENTS.ATTACK,
          {
            position:
            {
              x: x,
              y: y,
            },
            currentPlayer: playerId,
            status: statusAttack,
          },
          player.ws
        )
      }
      if (statusAttack === SHIP.MISS) {
        player.changeTurn()
        sendWSResponse(
          EVENTS.TURN,
          {
            currentPlayer: anotherUser.id,
          },
          player.ws
        )
      }

    });
  }
  else if (turnUser && turnUser.id === playerId) {
    console.log('this move has already been made, try another move');
  }
}