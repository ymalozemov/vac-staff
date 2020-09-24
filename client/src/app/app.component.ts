import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  subCsrf: Subscription
  constructor(private auth: AuthService, private cookieService: CookieService) { }

  ngOnInit() {
    const candidateToken = localStorage.getItem('auth-token')
    if (candidateToken !== null) {
      this.auth.setToken(candidateToken)
    }
    const candidateCsrf = this.cookieService.get('_csrf')
    if (!candidateCsrf) {
      this.subCsrf = this.auth.getCsrf().subscribe()
    }

  }
  ngOnDestroy() {
    if (this.subCsrf) {
      this.subCsrf.unsubscribe()
    }
  }
}
