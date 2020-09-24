import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/interfaces';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-user-form',
  templateUrl: './update-user-form.component.html',
  styleUrls: ['./update-user-form.component.css']
})
export class UpdateUserFormComponent implements OnInit, OnDestroy {
  user: User
  subUser: Subscription
  subRoute: Subscription
  constructor(private router: ActivatedRoute, private userService: UserService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.subRoute = this.router.params.subscribe(id => {
      this.subUser = this.userService.getById(id.id).subscribe((user) => {
        this.user = user
        this.userService.user = user
      }, error => {
        this._snackBar.open(error.error.message, 'Закрыть', {
          duration: 3000
        })
      })
    })
  }
  ngOnDestroy() {
    if (this.subUser) {
      this.subUser.unsubscribe()
    }
    if (this.subRoute) {
      this.subRoute.unsubscribe()
    }
    this.userService.user = {}
  }

}
