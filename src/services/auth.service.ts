import { Winner } from "../types/winners.ts";
import { User } from "../models/user.model.ts";
import { UserRepository } from "../models/user.repository.ts";

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async loginOrRegister(name: string, password: string): Promise<User> {
    if (!name || !password) {
      throw new Error('Name and password is required');
    }
    
    let user = this.userRepo.findByName(name);
      
    if (!user) {
      user = this.userRepo.createUser(name, password);
    } else if (user.password !== password) {
      throw new Error('Wrong password');
    }
    
    return user;
  }

  getWinners(): Array<Winner> {
    const users = this.userRepo.getAllUsers();

    return users.map((user) => {
      return {
        name: user.name,
        wins: user.wins,
      }
    })
  }
}