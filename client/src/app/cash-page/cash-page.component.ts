import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core'
import { PaymentService } from '../shared/services/payment.service'
import { Subscription, throwError } from 'rxjs'
import { MatSnackBar } from '@angular/material/snack-bar'
import { fromEvent } from 'rxjs'
import { map, debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators'

@Component({
  selector: 'app-cash-page',
  templateUrl: './cash-page.component.html',
  styleUrls: ['./cash-page.component.css']
})
export class CashPageComponent implements OnInit, OnDestroy {
  @ViewChild('contractInput') contractInput: ElementRef<HTMLInputElement>
  @ViewChild('form') form
  loading = false
  loadingPay = false
  subPayment: Subscription
  subInput: Subscription
  subPayments: Subscription
  payments = []
  constructor(private paymentService: PaymentService, private _snackBar: MatSnackBar, private changeDetector: ChangeDetectorRef, ) { }

  ngOnInit() {
    this.loading = true
    this.subPayment = this.paymentService.getAllToday().subscribe(payments => {
      this.payments = payments
      this.payments.sort(function (a, b) {
        if (a.approve < b.approve) {
          return -1
        }
        if (a.approve > b.approve) {
          return 1
        }
        return 0
      })
      this.payments.sort(function (a, b) {
        if (a.remark > b.remark) {
          return -1
        }
        if (a.remark < b.remark) {
          return 1
        }
        return 0
      })
      this.payments.sort(function (a, b) {
        if (a.correction > b.correction) {
          return -1
        }
        if (a.correction < b.correction) {
          return 1
        }
        return 0
      })
      this.loading = false
      this.initInput()
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
    })
  }
  initInput() {
    if (!this.changeDetector['destroyed']) {
      this.changeDetector.detectChanges()
      this.subInput = fromEvent(this.contractInput.nativeElement, 'input')
        .pipe(
          map(event => (<HTMLInputElement>event.target).value),
          debounceTime(1000),
          distinctUntilChanged(),
          mergeMap((data) => {
            this.loadingPay = true
            return this.paymentService.find({ contract: data })
          }),
        ).subscribe(data => {
          this.payments = data
          this.payments.sort(function (a, b) {
            if (a.approve < b.approve) {
              return -1
            }
            if (a.approve > b.approve) {
              return 1
            }
            return 0
          })
          this.payments.sort(function (a, b) {
            if (a.remark > b.remark) {
              return -1
            }
            if (a.remark < b.remark) {
              return 1
            }
            return 0
          })
          this.payments.sort(function (a, b) {
            if (a.correction > b.correction) {
              return -1
            }
            if (a.correction < b.correction) {
              return 1
            }
            return 0
          })
          this.loadingPay = false
        }, error => {
          this._snackBar.open(error.error.message, 'Закрыть', {
            duration: 3000
          })
        })
    }
  }
  getAllPayments() {
    this.form.nativeElement.reset()
    this.loadingPay = true
    this.subPayments = this.paymentService.find({ contract: '' }).subscribe(data => {
      this.payments = data
      this.payments.sort(function (a, b) {
        if (a.approve < b.approve) {
          return -1
        }
        if (a.approve > b.approve) {
          return 1
        }
        return 0
      })
      this.payments.sort(function (a, b) {
        if (a.remark > b.remark) {
          return -1
        }
        if (a.remark < b.remark) {
          return 1
        }
        return 0
      })
      this.payments.sort(function (a, b) {
        if (a.correction > b.correction) {
          return -1
        }
        if (a.correction < b.correction) {
          return 1
        }
        return 0

      })
      this.loadingPay = false
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
    })
  }
  ngOnDestroy() {
    if (this.subPayment) {
      this.subPayment.unsubscribe()
    }
    if (this.subInput) {
      this.subInput.unsubscribe()
    }
    if (this.subPayments) {
      this.subPayments.unsubscribe()
    }
  }

}
