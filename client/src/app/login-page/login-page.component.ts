import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPermissionsService } from 'ngx-permissions';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private _snackBar: MatSnackBar, private permissionService: NgxPermissionsService) { }
  sub: Subscription
  subRoute: Subscription
  form: FormGroup

  ngOnInit(): void {
    this.form = new FormGroup({
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
    this.subRoute = this.route.queryParams.subscribe((params: Params) => {
      if (params['accessDenied']) {
        this._snackBar.open('accessDenied.', 'Закрыть', {
          duration: 3000
        })
      } else if (params['sessionFailed']) {
        this._snackBar.open('Время сессии истекло, пожалуйста, авторизуйтесь снова.', '', {
          duration: 3000
        })
      } else if (params['permissionDenied']) {
        this._snackBar.open('Доступ запрещен, попробуйте авторизоваться снова.', '', {
          duration: 3000
        })
      }
    })
  }
  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe()
    }
    if (this.subRoute) {
      this.subRoute.unsubscribe()
    }
  }
  onSubmit() {
    this.form.disable()
    this.sub = this.auth.login(this.form.value).subscribe(
      (user) => {
        const roles = {
          admin: 'ADMIN',
          user: 'USER'
        }
        if (user.role === roles.user) {
          this.permissionService.addPermission('USER')
          this.router.navigate(['/main'])
        }
        if (user.role === roles.admin) {
          this.permissionService.addPermission('ADMIN')
          this.router.navigate(['/admin'])
        }
      },
      error => {
        this._snackBar.open(error.error.message, 'Закрыть', {
          duration: 3000
        })
        this.form.enable()
      }
    )
  }


}
