import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-username',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './username.component.html',
  styleUrls: ['./username.component.css']
})
export class UsernameComponent {
  username: string | null = null;
  @Output() usernameSet = new EventEmitter<string>();

  setUsername() {
    if (this.username.trim()) {
      this.usernameSet.emit(this.username);
    }
  }
}