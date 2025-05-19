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
}