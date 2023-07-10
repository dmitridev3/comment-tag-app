import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CommentBoxComponent } from './components/comment-box/comment-box.component';
import { MentionDirective } from './directives/mention.directive';
import { TasksService } from './services/tasks.service';
import { MentionListComponent } from './components/mention-list/mention-list.component'; // Import TasksService

@NgModule({
  declarations: [
    AppComponent,
    CommentBoxComponent,
    MentionDirective,
    MentionListComponent,
  ],
  imports: [BrowserModule, FormsModule, HttpClientModule],
  providers: [
    TasksService, // Add TasksService to the providers array
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
