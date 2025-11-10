import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('[AuthGuard] Checking authentication', {
    targetUrl: state.url,
    initialized: authService.initialized()
  });

  // Wait for auth service to initialize (including redirect result processing)
  // This ensures redirect authentication is processed before checking auth state
  if (!authService.initialized()) {
    console.log('[AuthGuard] ⏳ Waiting for auth initialization...');
    // Wait for initialization - check every 100ms, max 3 seconds
    let attempts = 0;
    while (!authService.initialized() && attempts < 30) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    console.log('[AuthGuard] Auth initialized:', authService.initialized());
  }

  const isAuthenticated = authService.isAuthenticated();
  console.log('[AuthGuard] Auth check result:', {
    isAuthenticated,
    targetUrl: state.url
  });

  if (isAuthenticated) {
    console.log('[AuthGuard] ✅ User authenticated, allowing access');
    return true;
  }

  console.log('[AuthGuard] ⚠️ User not authenticated, redirecting to login');
  authService.setRedirectUrl(state.url);
  return router.createUrlTree(['/login']);
};
