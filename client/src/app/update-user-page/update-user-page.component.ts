import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { UserService } from '../shared/services/user.service'
import { Subscription } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { User } from '../shared/interfaces'
import { Router } from '@angular/router'




@Component({
  selector: 'app-update-user-page',
  templateUrl: './update-user-page.component.html',
  styleUrls: ['./update-user-page.component.css']
})
export class UpdateUserPageComponent implements OnInit, OnDestroy {
  subUser: Subscription
  loading = false
  unbounded = false
  displayedColumns: string[] = ['position', 'name', 'login', 'role']
  ELEMENT_DATA: User[] = []
  dataSource = new MatTableDataSource(this.ELEMENT_DATA)
  constructor(private userService: UserService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit(): void {
    this.loading = true
    if (!this.userService.users.length) {
      this.subUser = this.userService.getAll().subscribe(
        (users) => {
          this.ELEMENT_DATA = users
          this.userService.users = users
          this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
          this.loading = false
        },
        error => {
          this._snackBar.open(error.error.message, 'Закрыть', {
            duration: 3000
          })
          this.loading = false
        })
    } else {
      this.ELEMENT_DATA = this.userService.users
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA)
      this.loading = false
    }
  }
  ngOnDestroy(): void {
    if (this.subUser) {
      this.subUser.unsubscribe()
    }
  }
  openUser(event) {
    if (event.target.attributes.id) {
      this.router.navigate([`/admin/admin-panel/update-user/${event.target.attributes.id.value}`])
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()
  }
}
