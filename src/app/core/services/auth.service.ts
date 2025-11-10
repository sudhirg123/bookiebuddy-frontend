import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut
} from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { Router } from '@angular/router';
import { UserProfile } from '../../models/user.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';

const USER_STORAGE_KEY = environment.storage.userKey;
const TOKEN_STORAGE_KEY = environment.storage.authTokenKey;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly auth: Auth;
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);
  private readonly provider = new GoogleAuthProvider();

  private readonly userSignal = signal<UserProfile | null>(this.restoreUser());
  private readonly tokenSignal = signal<string | null>(this.restoreToken());
  private readonly loadingSignal = signal(false);
  private readonly initializedSignal = signal(false);
  private readonly redirectUrlSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly token = this.tokenSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly initialized = this.initializedSignal.asReadonly();
  readonly redirectUrl = this.redirectUrlSignal.asReadonly();

  constructor() {
    // Initialize Firebase Auth
    const apps = getApps();
    const firebaseApp = apps.length > 0 ? apps[0] : initializeApp(environment.firebase);
    this.auth = getAuth(firebaseApp);
    
    // Set persistence
    setPersistence(this.auth, browserLocalPersistence).catch((error) =>
      console.warn('[AuthService] Unable to set persistence:', error)
    );
    
    this.provider.setCustomParameters({
      prompt: 'select_account'
    });

    console.log('[AuthService] Initializing...', {
      url: window.location.href,
      currentUser: this.auth.currentUser?.email || 'none',
      hostname: window.location.hostname,
      referrer: document.referrer
    });
    
    // Check if we're coming back from Firebase hosting redirect
    const cameFromFirebase = document.referrer.includes('firebaseapp.com');
    const hasAuthParams = window.location.search.includes('code=') || 
                         window.location.search.includes('state=') ||
                         window.location.hash.includes('code=') ||
                         window.location.hash.includes('state=');
    
    console.log('[AuthService] Redirect detection:', {
      cameFromFirebase,
      hasAuthParams,
      referrer: document.referrer,
      search: window.location.search,
      hash: window.location.hash
    });
    
    // Process redirect results (needed when popup fallback uses redirect)
    this.handleRedirectResult();

    // Set up auth state listener
    onAuthStateChanged(this.auth, async (firebaseUser) => {
      console.log('[AuthService] 🔄 Auth state changed:', {
        hasUser: !!firebaseUser,
        email: firebaseUser?.email,
        path: window.location.pathname,
        url: window.location.href
      });
      
      if (firebaseUser) {
        const profile = this.mapUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        this.persist(profile, token);
        console.log('[AuthService] ✅✅✅ USER AUTHENTICATED! Email:', profile.email);
        
        // ALWAYS navigate away from login/auth handler pages when user is authenticated
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath.includes('__/auth/handler')) {
          console.log('[AuthService] 🚀🚀🚀 User authenticated on auth page - NAVIGATING TO /books');
          
          // Clear any stored redirect URL that points to login
          const storedRedirect = this.consumeRedirectUrl();
          const redirect = (storedRedirect && storedRedirect !== '/login') ? storedRedirect : '/books';
          
          console.log('[AuthService] Target redirect:', redirect);
          
          // Use multiple navigation attempts to ensure it works
          const navigate = async () => {
            try {
              const success = await this.router.navigateByUrl(redirect, { replaceUrl: true });
              console.log('[AuthService] ✅ Router navigation result:', success);
              if (!success) {
                console.log('[AuthService] Router navigation failed, using window.location');
                window.location.href = redirect;
              }
            } catch (err) {
              console.error('[AuthService] ❌ Navigation error:', err);
              window.location.href = redirect;
            }
          };
          
          // Try immediately
          navigate();
          
          // Also try after a short delay as backup
          setTimeout(() => {
            if (window.location.pathname === '/login' || window.location.pathname.includes('__/auth/handler')) {
              console.log('[AuthService] Still on auth page, forcing navigation again...');
              navigate();
            }
          }, 500);
        }
      } else {
        console.log('[AuthService] ❌ No user in auth state');
        // Only clear if we're not on the auth handler route (might be processing)
        if (!window.location.pathname.includes('__/auth/handler')) {
          this.clearSession();
        }
      }
      
      this.initializedSignal.set(true);
    });
  }

  private async handleRedirectResult(): Promise<void> {
    try {
      console.log('[AuthService] Checking redirect result...');
      const result = await getRedirectResult(this.auth);
      if (result?.user) {
        const profile = this.mapUser(result.user);
        const token = await result.user.getIdToken();
        this.persist(profile, token);
        this.toast.success('Welcome back!', `Signed in as ${profile.displayName ?? 'Reader'}.`);
        const redirect = this.consumeRedirectUrl() ?? '/books';
        console.log('[AuthService] Redirect result processed, navigating to:', redirect);
        this.router.navigateByUrl(redirect, { replaceUrl: true });
      }
    } catch (error) {
      console.error('[AuthService] Redirect result error:', error);
    }
  }

  async loginWithGoogle(): Promise<void> {
    console.log('[AuthService] 🔐 loginWithGoogle called', {
      loading: this.loadingSignal(),
      authenticated: this.isAuthenticated(),
      currentUrl: window.location.href,
      hostname: window.location.hostname
    });
    
    if (this.loadingSignal()) {
      console.log('[AuthService] ⚠️ Already loading, skipping');
      return;
    }

    if (this.isAuthenticated()) {
      console.log('[AuthService] ⚠️ Already authenticated, skipping');
      return;
    }

    this.loadingSignal.set(true);
    console.log('[AuthService] Trying POPUP authentication first');
    try {
      const result = await signInWithPopup(this.auth, this.provider);
      if (result.user) {
        console.log('[AuthService] ✅ Popup success!', result.user.email);
        const profile = this.mapUser(result.user);
        const token = await result.user.getIdToken();
        this.persist(profile, token);
        this.toast.success('Welcome back!', `Signed in as ${profile.displayName ?? 'Reader'}.`);
        const redirect = this.consumeRedirectUrl() ?? '/books';
        this.router.navigateByUrl(redirect, { replaceUrl: true });
        return;
      }
    } catch (error: any) {
      console.error('[AuthService] ❌ Popup error:', error);
      if (
        error?.code === 'auth/popup-blocked' ||
        error?.code === 'auth/cancelled-popup-request' ||
        error?.code === 'auth/network-request-failed'
      ) {
        console.log('[AuthService] Falling back to redirect sign-in');
        try {
          await setPersistence(this.auth, browserLocalPersistence);
          await signInWithRedirect(this.auth, this.provider);
          return;
        } catch (redirectError: any) {
          console.error('[AuthService] ❌ Redirect fallback error:', redirectError);
          this.toast.error('Login failed', 'Please try again.');
        }
      } else if (error?.code !== 'auth/popup-closed-by-user') {
        this.toast.error('Login failed', 'Please try again.');
      }
    } finally {
      this.loadingSignal.set(false);
    }
  }

  setRedirectUrl(url: string | null): void {
    this.redirectUrlSignal.set(url);
  }

  consumeRedirectUrl(): string | null {
    const url = this.redirectUrlSignal();
    this.redirectUrlSignal.set(null);
    return url;
  }

  async logout(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      await signOut(this.auth);
      this.clearSession();
      this.toast.info('Signed out', 'Come back soon for more reading adventures!');
    } catch (error) {
      this.toast.error('Logout failed', 'Please refresh the page and try again.');
      console.error('Sign-out error', error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private persist(user: UserProfile, token: string): void {
    this.userSignal.set(user);
    this.tokenSignal.set(token);
    this.storage.setItem(USER_STORAGE_KEY, user);
    this.storage.setItem(TOKEN_STORAGE_KEY, token);
  }

  private clearSession(): void {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    this.storage.removeItem(USER_STORAGE_KEY);
    this.storage.removeItem(TOKEN_STORAGE_KEY);
  }

  private mapUser(user: User): UserProfile {
    return {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    };
  }

  private restoreUser(): UserProfile | null {
    return this.storage.getItem<UserProfile>(USER_STORAGE_KEY);
  }

  private restoreToken(): string | null {
    return this.storage.getItem<string>(TOKEN_STORAGE_KEY);
  }
}
