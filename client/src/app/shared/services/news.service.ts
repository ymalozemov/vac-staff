import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { News } from '../interfaces'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }
  news: News
  create(news): Observable<News> {
    return this.http.post<News>('/api/auth/news', news)
  }

}
