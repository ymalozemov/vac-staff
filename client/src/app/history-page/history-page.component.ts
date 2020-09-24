import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from '../shared/services/payment.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Location } from '@angular/common'

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy {
  loading = false
  subPayment: Subscription
  payments = []
  constructor(
    private paymentService: PaymentService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private location: Location) { }

  ngOnInit() {
    this.loading = true
    this.subPayment = this.paymentService.getAllTodayUser().subscribe(payments => {
      this.payments = payments
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
      this.loading = false
    })
  }
  ngOnDestroy() {
    if (this.subPayment) {
      this.subPayment.unsubscribe()
    }
  }
  click(payment) {
    if (payment.barcodes) {
      this.router.navigate([this.location.path() + '/ind' + `/${payment._id}`])
    }
    if (payment.refNumbers) {
      this.router.navigate([this.location.path() + '/ta' + `/${payment._id}`])
    }
  }

}
