import { IShip } from "./types";
import { Player } from "./ws_server/modules/Player"
import { Room } from "./ws_server/modules/Room";


export class DB {
  players: Player[] = [];
  rooms: Room[] = [];

  addShips(gameId: string, playerId: string, ships: IShip[]) {
    this.rooms.map((room) => {
      if (room.id === gameId) {
        room.players.map(player => player.id === playerId ? player.addShips(ships) : player)
      } else {
        return room;
      }
    })
  }

  isStartGame(gameId: string) {
    const currentRoom = this.rooms.find((room) => room.id === gameId);
    return currentRoom && currentRoom.players.length === 2 && currentRoom.players.every(player => player.ships.length);
  }

  getRoomPlayers(gameId: string): Player[] {
    const currentRoom = this.rooms.find((room) => room.id === gameId)
    return currentRoom
      ? currentRoom.players
      : [];
  }

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }

  addRoom(newRoom: Room) {
    this.rooms.push(newRoom);
  }

  addPlayerToRoom(roomId: string, player: Player) {
    this.rooms.map((room) => room.id === roomId ? room.addPlayer(player) : room);
  }

  getRoomsForResp() {
    return JSON.stringify(this.rooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.players.map((player) => ({ name: player.name, index: player.id }))
    })))
  }

  deleteRoom(roomId: string) {
    this.rooms.filter((room) => room.id !== roomId);
  }
}