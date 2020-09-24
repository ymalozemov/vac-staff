import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TravelAgentService {
  ta = []
  constructor(private http: HttpClient) { }

  create(travelAgent): Observable<any> {
    return this.http.post<any>('/api/travel-agent', travelAgent)
  }
  getAll(): Observable<any> {
    return this.http.get<any>('/api/travel-agent')
  }
}
