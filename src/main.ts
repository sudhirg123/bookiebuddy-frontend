import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error('Error starting application:', err);
    // Display error on page if bootstrap fails
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h1>Application Error</h1>
        <p>Failed to start the application. Please check the browser console for details.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${err?.message || err?.toString() || 'Unknown error'}</pre>
      </div>
    `;
  });
