import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withViewTransitions, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes, 
      withViewTransitions(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' })
    ),
    provideHttpClient()
  ]
};
