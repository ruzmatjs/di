import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { APP_CONFIG, DEFAULT_CONFIG } from './app/core/tokens';

// DI DARSLIGI №1: bootstrapApplication — root Environment Injector shu yerda quriladi.
// NgModule'dagi AppModule o'rnini ApplicationConfig (providers ro'yxati) egallaydi.
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    // DI DARSLIGI №2: InjectionToken + useValue — class bo'lmagan qiymatni DI orqali berish
    { provide: APP_CONFIG, useValue: DEFAULT_CONFIG },
  ],
}).catch(err => console.error(err));
