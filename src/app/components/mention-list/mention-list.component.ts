import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user.model'; // Import User model

@Component({
  selector: 'app-mention-list',
  templateUrl: './mention-list.component.html',
  styleUrls: ['./mention-list.component.scss'],
})
export class MentionListComponent {
  @Input() users!: User[]; // Use User model for users
  @Output() userSelected = new EventEmitter<string>();
  selectedIndex: number = 0;

  // Add methods to navigate the list using the arrow keys
  navigateUp() {
    if (this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  navigateDown() {
    if (this.selectedIndex < this.users.length - 1) {
      this.selectedIndex++;
    }
  }

  // Update selectUser method to emit selectedIndex
  selectUser() {
    this.userSelected.emit(this.users[this.selectedIndex].name);
  }

  onMouseEnter(index: number) {
    this.selectedIndex = index;
  }

  // Add method to reset selectedIndex when the cursor leaves the list
  onMouseLeave() {
    this.selectedIndex = -1;
  }
}
