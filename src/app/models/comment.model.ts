import { User } from './user.model';

export interface Comment {
  id: number;
  text: string;
  user: User;
  mentions?: User[];
}
