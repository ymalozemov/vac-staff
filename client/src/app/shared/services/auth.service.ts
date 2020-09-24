import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { NgxPermissionsService } from 'ngx-permissions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token = null

  constructor(private http: HttpClient, private cookieService: CookieService, private permissionsService: NgxPermissionsService) { }

  getCsrf() {
    return this.http.get<{ message: string }>('/api/auth')
  }
  login(user: User): Observable<{ token: string, role: string }> {
    return this.http.post<{ token: string, role: string }>('/api/auth/login', user)
      .pipe(
        tap(({ token }) => {
          localStorage.setItem('auth-token', token)
          this.setToken(token)
        })
      )
  }
  setToken(token: string) {
    this.token = token
  }
  getToken(): string {
    return this.token
  }
  isAuthenticated(): boolean {
    return !!this.token
  }
  logout() {
    this.setToken(null)
    localStorage.clear()
    this.permissionsService.flushPermissions()
  }
}
