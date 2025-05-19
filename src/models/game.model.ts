import { Player, Ship } from "../types/game.ts";

export class Game {
  public currentPlayer: string;
  public attacks = new Map<string, Set<string>>();
  constructor(
    public id: string,
    public player1: Player,
    public player2: Player,
    firstPlayerId: string,
    public status: 'waiting_ships' | 'ready' | 'started' = 'waiting_ships',
  ) {
    this.currentPlayer = firstPlayerId;
  }

  areBothPlayersReady(): boolean {
    return !!this.player1.ships && !!this.player2.ships;
  }

  getPlayerById(playerId: string) {
    return this.player1.playerId === playerId ? this.player1 : 
           this.player2.playerId === playerId ? this.player2 : null;
  }

  switchPlayer() {
    this.currentPlayer = 
      this.currentPlayer === this.player1.playerId 
        ? this.player2.playerId 
        : this.player1.playerId;
  }

  recordAttack(playerId: string, x: number, y: number) {
    const key = `${x},${y}`;
    if (!this.attacks.has(playerId)) {
      this.attacks.set(playerId, new Set());
    }
    this.attacks.get(playerId)?.add(key);
  }

  wasAttacked(playerId: string, x: number, y: number): boolean {
    return this.attacks.get(playerId)?.has(`${x},${y}`) || false;
  }

  getOpponent(playerId: string) {
    if (this.player1.playerId === playerId) {
      return this.player2;
    } else if (this.player2.playerId === playerId) {
      return this.player1;
    }
    return null;
  }

  checkWinCondition(): string | null {
    if (this.player2.ships && this.areAllShipsDestroyed(this.player2.ships, this.player1.playerId)) {
      return this.player1.playerId;
    }
  
    if (this.player1.ships && this.areAllShipsDestroyed(this.player1.ships, this.player2.playerId)) {
      return this.player2.playerId;
    }
  
    return null;
  }
  
  private areAllShipsDestroyed(ships: Array<Ship>, attackerId: string): boolean {
    const attackedCells = this.attacks.get(attackerId) || new Set();
  
    return ships.every(ship => {
      const shipCells = this.getShipCells(ship);
      return shipCells.every(cell => 
        attackedCells.has(`${cell.x},${cell.y}`)
      );
    });
  }
  
  private getShipCells(ship: Ship): {x: number, y: number}[] {
    const cells = [];
    const { position: {x, y}, direction, length } = ship;
  
    for (let i = 0; i < length; i++) {
      cells.push({
        x: direction ? x : x + i,
        y: direction ? y + i : y
      });
    }
  
    return cells;
  }
}