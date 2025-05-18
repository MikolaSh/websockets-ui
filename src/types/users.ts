export type User = {
  name: string;
  index: string;
  password: string;
}

export type Users = {
  [key: string]: User
}

