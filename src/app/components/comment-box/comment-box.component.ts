import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-comment-box',
  templateUrl: './comment-box.component.html',
  styleUrls: ['./comment-box.component.scss'],
})
export class CommentBoxComponent implements OnInit {
  task: any;
  newCommentText: string = '';

  constructor(private tasksService: TasksService) {}

  ngOnInit(): void {
    // Get the first task for simplicity
    this.tasksService.getTasks().subscribe((tasks) => (this.task = tasks[0]));
  }

  onCommentInputChange(event: any) {
    this.newCommentText = event;
  }

  addComment() {
    if (this.newCommentText) {
      const newComment: any = {
        id: this.task.comments.length + 1,
        text: this.newCommentText,
        user: 'Current User', // Replace with the actual user data
      };

      this.tasksService.addComment(this.task.id, newComment).subscribe(() => {
        this.newCommentText = '';
      });
    }
  }
}
