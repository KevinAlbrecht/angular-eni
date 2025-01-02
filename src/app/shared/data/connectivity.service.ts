import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConnectivityService {
  private onlineStatus = new BehaviorSubject<boolean>(navigator.onLine);
  onlineStatus$ = this.onlineStatus.asObservable();
  get onlineStatusValue() {
    return this.onlineStatus.value;
  }

  constructor() {
    window.addEventListener('online', () => this.onlineStatus.next(true));
    window.addEventListener('offline', () => this.onlineStatus.next(false));
  }
}
