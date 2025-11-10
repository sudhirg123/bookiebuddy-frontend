import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    providePrimeNG({
      ripple: true
    }),
    MessageService,
    provideFirebaseApp(() => initializeApp(environment.firebase))
  ]
};
