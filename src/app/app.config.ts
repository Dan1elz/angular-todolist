import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { UserService } from './services/user.service';


const appInicializerProvider = (UserService: UserService) => {
  return () => {
    UserService.TrySyncLocalStorage();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInicializerProvider,
      deps: [ UserService ],
      multi: true,
    }
  ]
};
