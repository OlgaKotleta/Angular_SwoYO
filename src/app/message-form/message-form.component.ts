import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Импортируем FormsModule
@Component({
  selector: 'app-message-form',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './message-form.component.html',
  styleUrls: ['./message-form.component.css'] 
})
export class MessageFormComponent {
  messageText: string = '';
  @Output() messageSent = new EventEmitter<string>();

  sendMessage() {
    if (this.messageText.trim()) {
      this.messageSent.emit(this.messageText);
      this.messageText = '';
    }
  }
}