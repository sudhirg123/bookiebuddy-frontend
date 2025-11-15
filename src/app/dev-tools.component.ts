import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { ToastService } from './core/services/toast.service';

@Component({
  selector: 'app-dev-tools',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dev-tools" *ngIf="authService.isAuthenticated()">
      <button class="copy-token-btn" (click)="copyToken()">
        <i class="pi pi-copy"></i>
        Copy Auth Token
      </button>
    </div>
  `,
  styles: [`
    .dev-tools {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
    }

    .copy-token-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .copy-token-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    .copy-token-btn:active {
      transform: translateY(0);
    }

    .copy-token-btn i {
      font-size: 1rem;
    }
  `]
})
export class DevToolsComponent {
  readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);

  async copyToken() {
    const token = this.authService.token();

    if (!token) {
      this.toast.error('No token', 'Please sign in first');
      return;
    }

    try {
      await navigator.clipboard.writeText(token);
      this.toast.success('Token copied!', 'Paste it in your API testing tool');
      console.log('🔑 Firebase Auth Token:', token);
      console.log('📋 Use in header: Authorization: Bearer ' + token);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = token;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.toast.success('Token copied!', 'Paste it in your API testing tool');
      console.log('🔑 Firebase Auth Token:', token);
    }
  }
}
