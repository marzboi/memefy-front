import { User } from './user';
import { Image } from './image';

export type Post = {
  id: string;
  description: string;
  image: Image;
  owner: User;
  flair: string;
  comments: Comment[];
};

export type Comment = {
  comment: string;
  owner: User;
};

export type PostResponse = {
  items: Post[];
  count: number;
  next: string | null;
  previous: string | null;
};
