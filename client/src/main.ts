// import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
// import  { AppComponent } from './app/app.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));




// src/main.ts

import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom }   from '@angular/core';
import { HttpClientModule }     from '@angular/common/http';
import { provideRouter }        from '@angular/router';

import { AppComponent }         from './app/app.component';
import { routes }               from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),  // <-- makes HttpClient injectable
    provideRouter(routes),                 // <-- sets up your router
    // any other providers you had in appConfig…
  ]
})
.catch(err => console.error(err));
