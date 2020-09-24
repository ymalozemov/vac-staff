import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  payment: any = {}
  constructor(private http: HttpClient) { }

  create(payment): Observable<any> {
    return this.http.post<any>('/api/payment/create', payment)
  }
  createTa(payment): Observable<any> {
    return this.http.post<any>('/api/payment/create-ta', payment)
  }
  getAllToday(): Observable<any> {
    return this.http.get<any>('/api/payment')
  }
  getAllTodayUser(): Observable<any> {
    return this.http.get<any>('/api/payment/user')
  }
  getById(id: string): Observable<any> {
    return this.http.get<any>(`/api/payment/${id}`)
  }
  find(contract): Observable<any> {
    return this.http.post<any>('/api/payment/find', contract)
  }
  message(message: string, id: string): Observable<any> {
    return this.http.post<any>(`/api/payment/message`, { message, id })
  }
  approve(id): Observable<any> {
    return this.http.post<any>('/api/payment/approve', id)
  }
  unapprove(id): Observable<any> {
    return this.http.post<any>('/api/payment/unapprove', id)
  }
  updateById(payment): Observable<any> {
    return this.http.post<any>('/api/payment/updateById', payment)
  }
  updateRefStatus(idPayment, idRef): Observable<any> {
    return this.http.post<any>('/api/payment/updateRefStatus', { idPayment, idRef })
  }
}
