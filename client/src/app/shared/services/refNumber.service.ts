import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefNumberService {
  refNumbers = []
  constructor(private http: HttpClient) { }

  create(refNumber): Observable<any> {
    return this.http.post<any>('/api/ref-number', refNumber)
  }
  getAllToday(): Observable<any> {
    return this.http.get<any>('/api/ref-number')
  }
}
