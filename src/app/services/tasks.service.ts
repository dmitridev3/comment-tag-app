import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Task } from '../models/task.model';
import { Comment } from '../models/comment.model'; // Import Comment from the comment.model.ts file

export class TasksService {
  tasks: Task[] = [
    { id: 1, title: 'Task 1', description: 'This is task 1', comments: [] },
    // more tasks...
  ];

  constructor() {}

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  addComment(taskId: number, comment: Comment): Observable<void> {
    const task = this.tasks.find((task) => task.id === taskId);

    if (task) {
      task.comments.push(comment);
    }

    return of();
  }
}
