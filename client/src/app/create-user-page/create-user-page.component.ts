import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../shared/interfaces';
import { UserService } from '../shared/services/user.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-user-page',
  templateUrl: './create-user-page.component.html',
  styleUrls: ['./create-user-page.component.css']
})
export class CreateUserPageComponent implements OnInit, OnDestroy {
  userSub: Subscription
  form: FormGroup
  hide = true
  hideSub = true
  user: User
  constructor(private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null),
      login: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
      subPassword: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })
  }
  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe()
    }
  }
  onSubmit() {
    this.form.disable()
    this.user = {
      name: this.form.value.name,
      password: this.form.value.password,
      login: this.form.value.login
    }
    this.userSub = this.userService.create(this.user).subscribe(
      (user) => {
        this._snackBar.open('Пользователь был зарегистрирован.', '', {
          duration: 3000
        })
        this.form.reset()
        this.userService.users = []
        this.form.enable()
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
