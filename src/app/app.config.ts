import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideServiceWorker } from '@angular/service-worker';
import { provideIndexedDb, DBConfig } from 'ngx-indexed-db';

import { routes } from './app.routes';
import { authInterceptor } from './identity/auth.interceptor';

const dbConfig: DBConfig = {
  name: 'kanban',
  version: 1,
  objectStoresMeta: [
    {
      store: 'columns',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'order', keypath: 'order', options: { unique: false } },
      ],
    },
    {
      store: 'tickets',
      storeConfig: { keyPath: 'id', autoIncrement: false },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        { name: 'description', keypath: 'description', options: { unique: false } },
        { name: 'type', keypath: 'type', options: { unique: false } },
        { name: 'assignee', keypath: 'assignee', options: { unique: false } },
        { name: 'order', keypath: 'order', options: { unique: false } },
        { name: 'columnId', keypath: 'columnId', options: { unique: false } },
      ],
    },
  ],
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideIndexedDb(dbConfig),
  ],
};
