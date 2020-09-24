import { NgZone, Injectable } from '@angular/core';
import { SseService } from './sse.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class WatcherService {
  badge
  constructor(private zone: NgZone, private sseService: SseService) { }

  watch(url: string): Observable<any> {
    return Observable.create(observer => {
      const eventSource = this.sseService.openEventSource(url)
      eventSource.onmessage = event => {
        this.zone.run(() => {
          observer.next(event)
        })
      }
      eventSource.onopen = open => {
        this.zone.run(() => {
          observer.next(open)
        })
      }
      eventSource.onerror = error => {
        this.zone.run(() => {
          this.sseService.close()
          observer.error(error)
        })
      }
    })
  }
  close() {
    this.sseService.close()
  }


}
