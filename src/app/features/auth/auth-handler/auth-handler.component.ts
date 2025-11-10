import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { getAuth } from 'firebase/auth';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';

const ensureApp = () => {
  if (!getApps().length) {
    return initializeApp(environment.firebase);
  }
  return getApp();
};

/**
 * Component to handle Firebase auth redirect handler endpoint.
 * This allows Firebase to process OAuth redirects at /__/auth/handler
 * without Angular routing interfering.
 */
@Component({
  selector: 'app-auth-handler',
  standalone: true,
  template: `
    <div style="padding: 20px; text-align: center;">
      <p>Processing authentication...</p>
    </div>
  `
})
export class AuthHandlerComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly auth = getAuth(ensureApp());

  ngOnInit(): void {
    console.log('[AuthHandlerComponent] 🔄 Component loaded at /__/auth/handler');
    console.log('[AuthHandlerComponent] URL:', window.location.href);
    console.log('[AuthHandlerComponent] Auth service authenticated:', this.authService.isAuthenticated());
    console.log('[AuthHandlerComponent] Firebase currentUser:', this.auth.currentUser?.email || 'none');
    
    // Wait for redirect processing - check multiple times
    let attempts = 0;
    const checkAuth = () => {
      attempts++;
      const isAuth = this.authService.isAuthenticated();
      const currentUser = this.auth.currentUser;
      
      console.log(`[AuthHandlerComponent] Check ${attempts}:`, {
        serviceAuth: isAuth,
        firebaseUser: currentUser?.email || 'none',
        path: window.location.pathname
      });
      
      if (isAuth || currentUser) {
        console.log('[AuthHandlerComponent] ✅ User authenticated!');
        const redirectUrl = this.authService.consumeRedirectUrl();
        const redirect = (redirectUrl && redirectUrl !== '/login') ? redirectUrl : '/books';
        console.log('[AuthHandlerComponent] Navigating to:', redirect);
        this.router.navigateByUrl(redirect, { replaceUrl: true });
      } else if (attempts < 10) {
        // Wait up to 3 seconds (300ms * 10)
        setTimeout(checkAuth, 300);
      } else {
        console.log('[AuthHandlerComponent] ❌ No authentication after 10 attempts');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    };
    
    // Start checking after a short delay
    setTimeout(checkAuth, 200);
  }
}
