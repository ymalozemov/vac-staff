import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[] = []
  user: User ={}
  constructor(private http: HttpClient) { }

  create(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/register', user)
  }
  getAll(): Observable<User[]> {
    return this.http.get<User[]>('/api/user')
  }
  getById(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`)
  }
}
