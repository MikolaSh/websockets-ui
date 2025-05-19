export type Winner = {
  name: string;
  wins: number;
}

export type WinnersUpdateResponse = {
  type: 'update_winners';
  data: Array<Winner> | string;
  id: 0;
}