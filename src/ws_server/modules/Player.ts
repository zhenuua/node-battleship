import crypto from "crypto";
import { WebSocket } from "ws";
import { IShip, IShipPosition } from "../../types";
import { SHIP } from "../../constants";

export class Player {
  name: string;
  password: string;
  id: string;
  error: boolean = false;
  errorText: string = '';
  ships: IShip[] = [];
  cellShips: IShipPosition[] = [];
  isTurn: boolean = false;
  ws: WebSocket;
  listTurns: IShipPosition[] = [];

  constructor(name: string, password: string, ws: WebSocket) {
    this.name = name;
    this.password = password;
    this.id = crypto.randomUUID();
    this.ws = ws;
  }

  addShips(ships: IShip[]) {
    this.ships = ships;
    this.convertShipsToCells(ships);
  }

  convertShipsToCells(ships: IShip[]) {
    this.cellShips = [];
    for (let numberShip = 0; numberShip < ships.length; numberShip++) {
      const ship = ships[numberShip]
      if (ship.direction) {
        for (let currentY = ship.position.y; currentY < ship.position.y + ship.length; currentY++) {
          this.cellShips.push({ x: ship.position.x, y: currentY })
        }
      }
      else {
        for (let currentX = ship.position.x; currentX < ship.position.x + ship.length; currentX++) {
          this.cellShips.push({ x: currentX, y: ship.position.y })
        }
      }
    }
  }

  changeTurn() {
    this.isTurn = !this.isTurn
  }

  getStatusAttack(x: number, y: number, anotherUser: Player) {
    let isFinishGame = false;
    let status = SHIP.MISS
    for (let numberShip = 0; numberShip < anotherUser.ships.length; numberShip++) {
      const ship = anotherUser.ships[numberShip]
      const currentShipPositions: IShipPosition[] = [];
      if (ship.direction) {
        for (let currentY = ship.position.y; currentY < ship.position.y + ship.length; currentY++) {
          currentShipPositions.push({ x: ship.position.x, y: currentY })
          if (x === ship.position.x && currentY === y) {
            status = SHIP.SHOT
          }
        }
      }
      else {
        for (let currentX = ship.position.x; currentX < ship.position.x + ship.length; currentX++) {
          currentShipPositions.push({ x: currentX, y: ship.position.y })
          if (currentX === x && y === ship.position.y) {
            status = SHIP.SHOT
          }
        }
      }
      const liveShipCells = currentShipPositions.filter(shipPosition => !this.listTurns.find(listTurn => (listTurn.x === shipPosition.x && shipPosition.y === listTurn.y)))
      if (status === SHIP.SHOT && liveShipCells.length === 0) {
        status = SHIP.KILLED;
        isFinishGame = this.isFinishGame(anotherUser);
      }
      if (status === SHIP.SHOT) return { status: SHIP.SHOT }
      if (status === SHIP.KILLED) return { status: SHIP.KILLED, killedShipPositions: currentShipPositions, isFinishGame }
    }
    return { status: status };
  }

  isFinishGame(anotherUser: Player) {
    const liveShipCells = anotherUser.cellShips.filter(shipPosition => !this.listTurns.find(listTurn => (listTurn.x === shipPosition.x && shipPosition.y === listTurn.y)))
    return !liveShipCells.length;
  }

  addNewTurn(x: number, y: number) {
    this.listTurns.push({ x, y })
  }

  cleanListTurns() {
    this.listTurns = [];
  }

  isCorrectTurn(x: number, y: number) {
    return !this.listTurns.find((turn) => turn.x === x && turn.y === y);
  }
}