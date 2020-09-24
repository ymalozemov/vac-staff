import { Component, OnInit, OnDestroy } from '@angular/core'
import { TimeTrackingService } from '../shared/services/timeTracking.service'
import { TimeTracking } from '../shared/interfaces'
import { Subscription } from 'rxjs'
import { FormGroup, FormControl } from '@angular/forms'
import { MatTableDataSource } from '@angular/material/table'
import { NgxPermissionsService } from 'ngx-permissions'
import { ActivatedRoute, Params } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
  selector: 'app-time-tracking-page',
  templateUrl: './time-tracking-page.component.html',
  styleUrls: ['./time-tracking-page.component.css']
})
export class TimeTrackingPageComponent implements OnInit, OnDestroy {
  subTimeTracking: Subscription
  subRoute: Subscription
  subGoHome: Subscription
  subAddStep: Subscription
  subNewDay: Subscription
  subRemove: Subscription
  loading = false
  form: FormGroup
  timeTracking: TimeTracking = {}
  displayedColumns = ['name', 'time', 'end', 'total'];
  stepsName = [
    { value: 'Front Office', viewValue: 'Front Office' },
    { value: 'Перерыв', viewValue: 'Перерыв' },
    { value: 'Обед', viewValue: 'Обед' },
    { value: 'Домой', viewValue: 'Домой' }
  ]
  steps: any = []
  constructor(private timeTrackingService: TimeTrackingService, private permissionService: NgxPermissionsService, private route: ActivatedRoute, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null)
    })
    this.loading = true
    this.subTimeTracking = this.timeTrackingService.getTimeTracking().subscribe((timeTracking) => {
      this.timeTracking = timeTracking
      if (this.timeTracking.startDay) {
        this.getPermission()
      }
      this.steps = new MatTableDataSource(timeTracking.steps)
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
      this.loading = false
    })
    this.subRoute = this.route.queryParams.subscribe((params: Params) => {
      if (params['permissionTimeTracking']) {
        this._snackBar.open('Необходимо ответиться в системе', 'Хорошо')
      }
    })

  }
  ngOnDestroy(): void {
    if (this.subTimeTracking) {
      this.subTimeTracking.unsubscribe()
    }
    if (this.subRoute) {
      this.subRoute.unsubscribe()
    }
    if (this.subGoHome) {
      this.subGoHome.unsubscribe
    }
    if (this.subAddStep) {
      this.subAddStep.unsubscribe()
    }
    if (this.subNewDay) {
      this.subNewDay.unsubscribe()
    }
    if (this.subRemove) {
      this.subRemove.unsubscribe()
    }
    this._snackBar.dismiss()
  }
  onSubmit() {
    this.loading = true
    if (this.timeTracking._id) {
      let stepIndex = this.timeTracking.steps.length - 1
      if (this.form.value.name === "Домой") {
        this.subGoHome = this.timeTrackingService.goHome(this.form.value, this.timeTracking._id, stepIndex).subscribe((timeTracking) => {
          this.timeTracking = timeTracking
          this.getPermission()
          this.steps = new MatTableDataSource(timeTracking.steps)
          this.loading = false
        }, error => {
          this._snackBar.open(error.error.message, 'Закрыть', {
            duration: 3000
          })
          this.loading = false
        })
      } else {
        let stepIndex = this.timeTracking.steps.length - 1
        this.subAddStep = this.timeTrackingService.addStep(this.form.value, this.timeTracking._id, stepIndex).subscribe((timeTracking) => {
          this.timeTracking = timeTracking
          this.getPermission()
          this.steps = new MatTableDataSource(timeTracking.steps)
          this.loading = false
        }, error => {
          this._snackBar.open(error.error.message, 'Закрыть', {
            duration: 3000
          })
          this.loading = false
        })
      }
    } else {
      this.subNewDay = this.timeTrackingService.startNewDay(this.form.value).subscribe((timeTracking) => {
        this.timeTracking = timeTracking
        this.getPermission()
        this.steps = new MatTableDataSource(timeTracking.steps)
        this.loading = false
      }, error => {
        this._snackBar.open(error.error.message, 'Закрыть', {
          duration: 3000
        })
        this.loading = false
      })
    }
  }
  remove() {
    this.loading = true
    let stepIndex = this.timeTracking.steps.length - 1
    let step = this.timeTracking.steps[stepIndex]
    this.subRemove = this.timeTrackingService.remove(this.timeTracking._id, stepIndex, step).subscribe((timeTracking) => {
      this.timeTracking = timeTracking
      this.steps = new MatTableDataSource(timeTracking.steps)
      this.getPermission()
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
      this.loading = false
    })
  }
  getPermission() {
    let permission = this.permissionService.getPermissions()
    let lastStep = this.timeTracking.steps[this.timeTracking.steps.length - 1]
    if (lastStep.deleted == false && lastStep.name !== 'Домой' && lastStep.name !== 'Перерыв' && lastStep.name !== 'Обед') {
      if (permission.ADMIN) {
        this.permissionService.addPermission("checkInAdmin")
      }
      if (permission.USER) {
        this.permissionService.addPermission("checkInUser")
      }
    } else {
      if (permission.ADMIN) {
        this.permissionService.removePermission("checkInAdmin")
      }
      if (permission.USER) {
        this.permissionService.removePermission("checkInUser")
      }
    }
  }
  getDate(endTime: string, time: string): any {
    let milisec = Date.parse(endTime) - Date.parse(time)
    let d, h, m, s
    if (isNaN(milisec)) {
      return false
    }
    if (milisec !== NaN) {
      d = milisec / 1000 / 60 / 60 / 24
      h = (d - ~~d) * 24
      m = (h - ~~h) * 60
      s = (m - ~~m) * 60
      return { h: ~~h, m: ~~m, s: ~~s }
    }
  }

}
