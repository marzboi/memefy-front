import { Post } from './post';
import { Image } from './image';

export type User = {
  id: string;
  userName: string;
  email: string;
  passwd: string;
  avatar: Image;
  createdPost: Post[];
  favoritePost: Post[];
};
