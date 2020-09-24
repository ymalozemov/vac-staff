import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { TimeTracking } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class TimeTrackingService {
  constructor(private http: HttpClient) { }

  getTimeTracking(): Observable<TimeTracking> {
    return this.http.get<TimeTracking>('/api/time-tracking')
  }
  startNewDay(step) {
    return this.http.post<TimeTracking>('/api/time-tracking', step)
  }
  addStep(step, id, stepIndex) {
    return this.http.put<TimeTracking>('/api/time-tracking', { step, id, stepIndex })
  }
  remove(id, stepIndex, step) {
    return this.http.put<TimeTracking>('/api/time-tracking/remove', { id, stepIndex, step })
  }
  goHome(step, id, stepIndex) {
    return this.http.put<TimeTracking>('/api/time-tracking/home', { step, id, stepIndex })
  }
}
