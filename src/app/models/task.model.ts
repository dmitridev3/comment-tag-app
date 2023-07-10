import { Comment } from './comment.model';

export interface Task {
  id: number;
  title: string;
  description: string;
  comments: Comment[];
}
