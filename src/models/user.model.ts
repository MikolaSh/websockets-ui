export class User {
  constructor(
    public index: number,
    public name: string,
    public password: string,
    public wins: number = 0
  ) {}
}