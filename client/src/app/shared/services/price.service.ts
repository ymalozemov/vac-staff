import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Price } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  constructor(private http: HttpClient) { }

  create(price: Price): Observable<Price> {
    return this.http.post<Price>('/api/price/create', price)
  }
  update(price: Price): Observable<any> {
    return this.http.put<Price>('/api/price/update', price)
  }
  getAll(): Observable<Price> {
    return this.http.get<Price>('/api/price')
  }

}
