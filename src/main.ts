import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

import { environment } from '~env/environment';

if (!environment.production) {
  import('./server').then(({ default: initServer }) => initServer());
}

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
