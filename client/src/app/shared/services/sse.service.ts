import { Injectable } from '@angular/core';
import { EventSourcePolyfill } from 'ng-event-source';
import { AuthService } from './auth.service';

EventSourcePolyfill.prototype.close = function () {
  this.controller.abort();
  this._close();
};
@Injectable({
  providedIn: 'root'
})
export class SseService {
  eventSourse: EventSourcePolyfill
  constructor(private auth: AuthService) { }
  openEventSource(url: string) {
    return this.eventSourse = new EventSourcePolyfill(url, { headers: { Authorization: this.auth.getToken() } });
  }
  close() {
    this.eventSourse.close()
  }

}
