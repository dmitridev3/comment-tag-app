import {
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentRef,
} from '@angular/core';
import { MentionListComponent } from '../components/mention-list/mention-list.component';
import { User } from '../models/user.model';

@Directive({
  selector: '[appMention]',
})
export class MentionDirective {
  users: User[] = [
    { userID: 1, name: 'Kevin' },
    { userID: 2, name: 'Jeff' },
    { userID: 3, name: 'Bryan' },
    { userID: 4, name: 'Gabbey' },
    { userID: 5, name: 'Bob' },
    { userID: 6, name: 'Kelly' },
    { userID: 7, name: 'Dave' },
    { userID: 8, name: 'Sam' },
  ];
  mentionList: ComponentRef<MentionListComponent> | null = null;
  previousSearchStr = '';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: KeyboardEvent): void {
    const inputValue: string = this.el.nativeElement.value;
    const words: string[] = inputValue.split(' ');
    const lastWord: string = words[words.length - 1];
    if (lastWord.startsWith('@')) {
      const searchUser: string = lastWord.slice(1);
      this.showMentions(searchUser);
    } else {
      this.hideMentions();
    }
  }

  // Add a HostListener for keydown events
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.mentionList) {
      if (event.key === 'ArrowUp') {
        event.preventDefault(); // Prevent textarea navigation
        this.mentionList.instance.navigateUp();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault(); // Prevent textarea navigation
        this.mentionList.instance.navigateDown();
      } else if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        this.mentionList.instance.selectUser();
      }
    }
  }

  showMentions(searchStr: string) {
    if (!this.mentionList) {
      const factory =
        this.resolver.resolveComponentFactory<MentionListComponent>(
          MentionListComponent
        );
      this.mentionList =
        this.viewContainerRef.createComponent<MentionListComponent>(factory);

      this.mentionList.instance.userSelected.subscribe((userName: string) => {
        this.selectMention(userName);
      });

      const rect: DOMRect = this.el.nativeElement.getBoundingClientRect();
      const cursorPos: DOMRect | null = this.getCursorPos();
      if (cursorPos) {
        this.renderer.setStyle(
          this.mentionList.location.nativeElement,
          'position',
          'fixed'
        );
        this.renderer.setStyle(
          this.mentionList.location.nativeElement,
          'left',
          rect.left + cursorPos.left + 'px'
        );
        this.renderer.setStyle(
          this.mentionList.location.nativeElement,
          'top',
          rect.top + cursorPos.top + 'px'
        );
      }
    }
    this.mentionList.instance.users = this.users.filter((user: User) =>
      user.name.toLowerCase().startsWith(searchStr.toLowerCase())
    );
  }

  private getCursorPos(): DOMRect | null {
    if (this.el.nativeElement.selectionStart !== null) {
      const start = this.el.nativeElement.selectionStart;
      const end = this.el.nativeElement.selectionEnd;
      const textBeforeCursor = this.el.nativeElement.value.substring(0, start);
      const textAfterCursor = this.el.nativeElement.value.substring(end);
      const textBeforeCursorWithNewLinesReplaced = textBeforeCursor.replace(
        /\n/g,
        '\u200B'
      );
      const textAfterCursorWithNewLinesReplaced = textAfterCursor.replace(
        /\n/g,
        '\u200B'
      );

      const range = document.createRange();
      const textNode = document.createTextNode(
        textBeforeCursorWithNewLinesReplaced +
          textAfterCursorWithNewLinesReplaced
      );
      range.selectNodeContents(textNode);
      range.setStart(textNode, textBeforeCursor.length);
      range.setEnd(textNode, textBeforeCursor.length);

      return range.getBoundingClientRect();
    } else {
      return null;
    }
  }

  hideMentions(): void {
    if (this.mentionList) {
      this.mentionList.destroy();
      this.mentionList = null;
    }
  }
  private getCaretCoordinates(): DOMRect | null {
    const sel = window.getSelection();
    if (!sel?.focusNode) return null;

    let range = document.createRange();
    range.selectNodeContents(sel.focusNode);
    range.setStart(sel.focusNode, sel.focusOffset);

    const span = document.createElement('span');
    span.textContent = '|';
    range.insertNode(span);

    const rect = span.getBoundingClientRect();
    if (span.parentNode) {
      span.parentNode.removeChild(span);
    }

    return rect;
  }

  selectMention(name: string): void {
    const inputValue: string = this.el.nativeElement.value;
    if (this.mentionList) {
      this.el.nativeElement.value = inputValue.replace(/@\w*$/, '@' + name);
      this.hideMentions();
    }
  }
}
