import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LoginPresenterComponent } from './login.presenter.component';

@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [CommonModule, LoginPresenterComponent],
  template: `
    <app-login-presenter [loading]="loading()" (login)="handleLogin()"></app-login-presenter>
  `
})
export class LoginContainerComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = computed(() => this.authService.loading());

  async ngOnInit(): Promise<void> {
    console.log('[LoginComponent] OnInit - URL:', window.location.href);
    console.log('[LoginComponent] Pathname:', window.location.pathname);
    console.log('[LoginComponent] Search params:', window.location.search);
    console.log('[LoginComponent] Hash:', window.location.hash);
    
    // Wait for auth service to initialize
    const checkAuth = () => {
      const isAuth = this.authService.isAuthenticated();
      console.log('[LoginComponent] Auth check:', {
        authenticated: isAuth,
        path: window.location.pathname
      });
      
      if (isAuth) {
        console.log('[LoginComponent] ✅ User authenticated, redirecting...');
        const redirect = this.authService.consumeRedirectUrl() ?? '/books';
        this.router.navigateByUrl(redirect, { replaceUrl: true });
      }
    };
    
    // Check immediately
    checkAuth();
    
    // Also check after initialization
    setTimeout(() => checkAuth(), 500);
    setTimeout(() => checkAuth(), 1500);
  }

  async handleLogin(): Promise<void> {
    if (this.authService.loading()) {
      return;
    }
    
    await this.authService.loginWithGoogle();
    // Page will redirect - no need to navigate here
  }
}
