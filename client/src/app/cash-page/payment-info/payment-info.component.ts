import { Component, OnInit, OnDestroy } from '@angular/core';
import { PaymentService } from 'src/app/shared/services/payment.service';
import { Subscription, forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PriceService } from 'src/app/shared/services/price.service';
import { Price } from 'src/app/shared/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { PaymentInfoModalComponent } from './payment-info-modal/payment-info-modal.component';

@Component({
  selector: 'app-payment-info',
  templateUrl: './payment-info.component.html',
  styleUrls: ['./payment-info.component.css']
})
export class PaymentInfoComponent implements OnInit, OnDestroy {
  subPayment: Subscription
  subDialog: Subscription
  subApprove: Subscription
  subUnApprove: Subscription
  payment: any = {}
  price: Price
  priceValue: any = {}
  foxName: any = {}
  loading = false
  barcodesRus = []
  barcodesGratis = []
  barcodesFullGratis = []
  barcodesNonRus = []
  rusCount = 0
  nonRusCount = 0
  gratisCount = 0
  totalTaCount = 0
  totalService = 0
  constructor(private paymentService: PaymentService,
    private router: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private priceService: PriceService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.loading = true
    this.subPayment = this.router.params.pipe(
      mergeMap((id: any) => {
        return forkJoin([
          this.paymentService.getById(id.id),
          this.priceService.getAll()
        ])
      })
    ).subscribe(result => {
      this.payment = result[0]
      this.paymentService.payment = result[0]
      this.price = result[1]
      if (this.payment.barcodes) {
        this.payment.barcodes.forEach(barcode => {
          if (barcode.fee == 'rus') {
            this.barcodesRus.push(barcode)
          }
          if (barcode.fee == 'gratis') {
            this.barcodesGratis.push(barcode)
          }
          if (barcode.fee == 'fullGratis') {
            this.barcodesFullGratis.push(barcode)
          }
          if (barcode.fee == 'nonRus') {
            this.barcodesNonRus.push(barcode)
          }
        });
      }
      this.price.services.forEach(value => {
        Object.assign(this.priceValue, { [value.value]: value.cost })
      })
      this.price.foxServices.forEach(value => {
        Object.assign(this.priceValue, { [value.value]: value.cost })
      })
      this.price.foxServices.forEach(value => {
        Object.assign(this.foxName, { [value.value]: value.name })
      })
      const keys = Object.keys(this.payment)
      keys.forEach(fee => {
        if (this.priceValue[fee]) {
          if (fee == 'copy' && this.payment[fee] > 10) {
            this.totalService += this.payment[fee] * this.priceValue.copy10
          } else if (fee == 'copy' && this.payment[fee] <= 10) {
            this.totalService += this.payment[fee] * this.priceValue[fee]
          } else {
            this.totalService += this.payment[fee] * this.priceValue[fee]
          }
        }
      });
      if (this.payment.foxValue) {
        this.totalService += (this.payment.foxCount * this.priceValue[this.payment.foxValue]) + (this.payment.foxCount * this.priceValue.foxService)
      }
      if (this.payment.rusCount) {
        this.totalTaCount += this.payment.rusCount
        this.rusCount = this.payment.rusCount
      }
      if (this.payment.nonRusCount) {
        this.totalTaCount += this.payment.nonRusCount
        this.nonRusCount = this.payment.nonRusCount
      }
      if (this.payment.gratisCount) {
        this.totalTaCount += this.payment.gratisCount
        this.gratisCount = this.payment.gratisCount
      }
      this.loading = false
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
    if (this.subApprove) {
      this.subApprove.unsubscribe()
    }
    if (this.subDialog) {
      this.subDialog.unsubscribe()
    }
    if (this.subUnApprove) {
      this.subUnApprove.unsubscribe()
    }
    this.paymentService.payment = {}
  }
  openDialog() {
    const dialogRef = this.dialog.open(PaymentInfoModalComponent, {
      width: '350px',
      panelClass: 'myClass',
    })
    this.subDialog = dialogRef.afterClosed()
      .subscribe((refNumbers) => {
      }, error => {
        this._snackBar.open(error.error.message, '', {
          duration: 3000
        })
      });
  }
  approve() {
    this.loading = true
    let id = { id: this.paymentService.payment._id }
    this.subApprove = this.paymentService.approve(id).pipe(
      mergeMap((message) => {
        this._snackBar.open(message.message, '', {
          duration: 3000
        })
        return this.paymentService.getById(id.id)
      }),
    ).subscribe(payment => {
      this.payment = payment
      this.paymentService.payment = payment
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, '', {
        duration: 3000
      })
      this.loading = false
    })
  }
  unApprove() {
    this.loading = true
    let id = { id: this.paymentService.payment._id }
    this.subUnApprove = this.paymentService.unapprove(id).pipe(
      mergeMap((message) => {
        this._snackBar.open(message.message, '', {
          duration: 3000
        })
        return this.paymentService.getById(id.id)
      }),
    ).subscribe(payment => {
      this.payment = payment
      this.paymentService.payment = payment
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, '', {
        duration: 3000
      })
      this.loading = false
    })
  }
}
