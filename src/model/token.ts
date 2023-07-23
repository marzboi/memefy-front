import { User } from './user';

export type LoggedUser = {
  userConnected: { token: string; user: Partial<User> };
};

export type LoginAnswer = {
  token: string;
  user: Partial<User>;
};
