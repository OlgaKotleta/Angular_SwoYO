import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Message } from '../chat.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnChanges {
  @Input() messages: Message[] = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['messages']) {
      console.log('Messages in MessageListComponent:', this.messages); 
    }
  }
}