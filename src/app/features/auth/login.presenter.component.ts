import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-presenter',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './login.presenter.component.html',
  styleUrl: './login.presenter.component.scss'
})
export class LoginPresenterComponent {
  @Input() loading = false;
  @Output() login = new EventEmitter<void>();
  
  onLogin(): void {
    if (this.loading) {
      return;
    }

    this.login.emit();
  }
}
