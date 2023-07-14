import { Game } from "./ws_server/modules/Game";
import { Player } from "./ws_server/modules/Player"
import { Room } from "./ws_server/modules/Room";


export class DB {
  players: Player[] = [];
  rooms: Room[] = [];
  games: Game[] = [];

  addPlayer(newPlayer: Player) {
    this.players.push(newPlayer);
  }

  addRoom(newRoom: Room) {
    this.rooms.push(newRoom);
  }

  getRoomsForResp() {
    return JSON.stringify(this.rooms.map((room) => ({
      roomId: room.id,
      roomUsers: room.players.map((player) => ({ name: player.name, index: player.id }))
    })))
  }

  addGame(game: Game) {
    this.games.push(game);
  }

  deleteRoom(roomId: string) {
    this.rooms.filter((room) => room.id !== roomId);
  }

  deleteGame(gameId: string) {
    this.games.filter((game) => game.id !== gameId);
  }
}