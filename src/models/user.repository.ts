import { Winner } from "../types/winners.ts";
import { User } from "./user.model.ts";

export class UserRepository {
  private users: User[] = [];
  private lastId = 0;

  findByName(name: string): User | undefined {
    return this.users.find(user => user.name === name);
  }

  createUser(name: string, password: string): User {
    const newUser = new User(++this.lastId, name, password);
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers() {
    return [...this.users];
  }

  async getWinners(): Promise<Array<Winner>> {
    return this.users
      .sort((a, b) => b.wins - a.wins)
      .map(user => ({
        name: user.name,
        wins: user.wins
      }));
  }

  async incrementWins(userId: string): Promise<void> {
    const user = this.users.find((user) => user.index.toString() === userId);
    if (user) {
      user.wins += 1;
    }
  }
}