import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Message {
  author: string;
  timestamp: Date;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messagesSubject.asObservable();

  private usernameSubject = new BehaviorSubject<string | null>(null);
  username$ = this.usernameSubject.asObservable();

  private broadcastChannel = new BroadcastChannel('chat_channel'); // Создаем канал

  constructor(private ngZone: NgZone) { 
    this.loadMessages();
    this.loadUsername();

    // Подписываемся на сообщения из других вкладок
    this.broadcastChannel.onmessage = (event) => {
      this.ngZone.run(() => { 
        if (event.data.type === 'message') {
          const messages = this.messagesSubject.value;
          const updatedMessages = [...messages, event.data.payload]; 
          this.messagesSubject.next(updatedMessages); 
          this.saveMessages();
        }
      });
    };
  }

  addMessage(text: string) {
    const messages = this.messagesSubject.value;
    const newMessage: Message = {
      author: this.usernameSubject.value || 'Anonymous',
      timestamp: new Date(),
      text: text
    };
    const updatedMessages = [...messages, newMessage]; 
    this.messagesSubject.next(updatedMessages); 
    this.saveMessages();

    // Отправляем сообщение в другие вкладки
    this.broadcastChannel.postMessage({
      type: 'message',
      payload: newMessage
    });
  }

  setUsername(username: string) {
    this.usernameSubject.next(username);
    localStorage.setItem('username', username); 
  }

  resetUsername() {
    localStorage.removeItem('username');
    this.usernameSubject.next(null);
  }

  private saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messagesSubject.value)); 
  }

  private loadMessages() {
    const messages = localStorage.getItem('messages');
    if (messages) {
      this.messagesSubject.next(JSON.parse(messages));
    }
  }

  private loadUsername() {
    const username = localStorage.getItem('username'); 
    if (username) {
      this.usernameSubject.next(username);
    } else {
      this.usernameSubject.next(null);
    }
  }
  // Метод для очистки сообщений
  clearMessages() {
    this.messagesSubject.next([]);
    localStorage.removeItem('messages'); 
  }
}