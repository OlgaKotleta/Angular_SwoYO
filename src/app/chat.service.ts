import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Message {
  author: string;
  timestamp: Date;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages: Message[] = []; 
  private messagesSubject = new Subject<Message[]>(); 
  messages$ = this.messagesSubject.asObservable();

  private username: string | null = null; 
  private usernameSubject = new Subject<string | null>(); 
  username$ = this.usernameSubject.asObservable();

  private broadcastChannel = new BroadcastChannel('chat_channel'); // Создаем канал

  constructor() {
    this.loadMessages();
    this.loadUsername();

    // Подписываемся на сообщения из других вкладок
    this.broadcastChannel.onmessage = (event) => {
      if (event.data.type === 'message') {
        this.messages = [...this.messages, event.data.payload]; 
        this.messagesSubject.next(this.messages); 
        this.saveMessages();
      }
    };
  }

  addMessage(text: string) {
    const newMessage: Message = {
      author: this.username || 'Anonymous',
      timestamp: new Date(),
      text: text
    };
    this.messages = [...this.messages, newMessage]; 
    this.messagesSubject.next(this.messages); 
    this.saveMessages();

    // Отправляем сообщение в другие вкладки
    this.broadcastChannel.postMessage({
      type: 'message',
      payload: newMessage
    });
  }

  setUsername(username: string) {
    this.username = username; 
    this.usernameSubject.next(username); 
    localStorage.setItem('username', username); 
  }

  resetUsername() {
    this.username = null;
    this.usernameSubject.next(null); 
    localStorage.removeItem('username');
  }

  private saveMessages() {
    localStorage.setItem('messages', JSON.stringify(this.messages)); 
  }

  private loadMessages() {
    const messages = localStorage.getItem('messages');
    if (messages) {
      this.messages = JSON.parse(messages);
      this.messagesSubject.next(this.messages); 
    }
  }

  private loadUsername() {
    const username = localStorage.getItem('username'); 
    if (username) {
      this.username = username; 
      this.usernameSubject.next(username); 
    } else {
      this.username = null;
      this.usernameSubject.next(null); 
    }
  }

  // Метод для очистки сообщений
  clearMessages() {
    this.messages = [];
    this.messagesSubject.next(this.messages); 
    localStorage.removeItem('messages'); 
  }
}