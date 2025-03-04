import { Component, ChangeDetectorRef } from '@angular/core';
import { ChatService, Message } from './chat.service';
import { MessageListComponent } from './message-list/message-list.component';
import { MessageFormComponent } from './message-form/message-form.component';
import { UsernameComponent } from './username/username.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MessageListComponent, MessageFormComponent, UsernameComponent,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  messages: Message[] = [];
  username: string | null = null;

  constructor(private chatService: ChatService, private cdr: ChangeDetectorRef) {
    // Подписываемся на изменения сообщений
    this.chatService.messages$.subscribe(messages => {
      this.messages = messages;
      this.cdr.detectChanges(); //обновляем интерфейс
    });

    // Подписываемся на изменения имени пользователя
    this.chatService.username$.subscribe(username => {
      this.username = username;
      this.cdr.detectChanges(); 
    });
  }

  onMessageSent(messageText: string) {
    this.chatService.addMessage(messageText);
  }

  onUsernameSet(username: string) {
    this.chatService.setUsername(username);
  }

  // Метод для логирования значения username
  logUsername(value: string | null): string | null {
    return value;
  }

  // Метод для сброса имени пользователя
  resetUsername() {
    localStorage.removeItem('username');
    this.username = null; 
   
  }
  clearMessages() {
    this.chatService.clearMessages();
  }
}