import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, FormControl, FormGroupDirective, NgForm, FormArray, Validators } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { MatDialog } from '@angular/material/dialog'
import { CreateRefComponent } from './create-ref/create-ref.component'
import { TravelAgentService } from '../shared/services/travelAgent.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Subscription, forkJoin, Observable } from 'rxjs'
import { RefNumberService } from '../shared/services/refNumber.service'
import { MatSelectionListChange } from '@angular/material/list'
import { MyValidators } from './my.validators'
import { Price } from '../shared/interfaces'
import { PriceService } from '../shared/services/price.service'
import { MatTableDataSource } from '@angular/material/table'
import { PaymentService } from '../shared/services/payment.service'
import { mergeMap } from 'rxjs/operators'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && control.touched)
  }
}

@Component({
  selector: 'app-create-payment-ta-page',
  templateUrl: './create-payment-ta-page.component.html',
  styleUrls: ['./create-payment-ta-page.component.css']
})
export class CreatePaymentTaPageComponent implements OnInit, OnDestroy {

  subInit: Subscription
  subRefTa: Subscription
  subRefStatus: Subscription
  subPayment: Subscription
  subDialog: Subscription
  payment: any
  foxes = []
  loading = false
  loadingRef = false
  loadingRefStatus = false
  selectedIdxFox = null
  form: FormGroup
  matcher = new MyErrorStateMatcher()
  travelAgents
  refNumbers = []
  refCount = 0
  price: Price
  priceValue: any = {}
  displayedColumns = ['applicant', 'count', 'fee', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
  dataSource: any = []
  data
  constructor(
    public dialog: MatDialog,
    private priceService: PriceService,
    private TravelAgentService: TravelAgentService,
    private _snackBar: MatSnackBar,
    public refNumberService: RefNumberService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private _location: Location) { }


  ngOnInit() {
    this.form = new FormGroup({
      applicant: new FormControl(null, [Validators.required, Validators.min(1)]),
      refCount: new FormControl(null, [Validators.required, Validators.min(1)]),
      contract: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      rusCount: new FormControl(null),
      gratisCount: new FormControl(null),
      fullGratisCount: new FormControl(null),
      nonRusCount: new FormControl(null),
      nameTa: new FormControl(null, Validators.required),
      refNumbers: new FormArray([], MyValidators.requiredRefNumbers),
      foxCount: new FormControl(0),
      foxValue: new FormControl(null),
      copy: new FormControl(null),
      form: new FormControl(null),
      photo: new FormControl(null),
      sms: new FormControl(null),
      vip: new FormControl(null),
      pers: new FormControl(null),
      ppb: new FormControl(null)
    }, [MyValidators.formValidador])
    this.loading = true
    this.subInit = this.route.params.pipe(
      mergeMap(data => {
        let forkAr = [
          this.TravelAgentService.getAll(),
          this.refNumberService.getAllToday(),
          this.priceService.getAll()
        ]
        if (data.id) {
          forkAr.push(this.paymentService.getById(data.id))
        }
        return forkJoin(forkAr)
      })
    ).subscribe(result => {
      this.travelAgents = result[0]
      this.TravelAgentService.ta = result[0]
      this.refNumbers = result[1]
      this.price = result[2]
      this.price.services.forEach(value => {
        let newObj = new Object({ [value.value]: value.cost })
        Object.assign(this.priceValue, newObj)
      })
      this.price.foxServices.forEach(value => {
        Object.assign(this.priceValue, { [value.value]: value.cost })
      })
      this.foxes = this.price.foxServices.filter(value => value.value !== 'foxService')
      if (result[3]) {
        this.payment = result[3]
        this.initValueForm(result[3])
      }
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, '', {
        duration: 3000
      })
    })
  }
  ngOnDestroy() {
    if (this.subInit) {
      this.subInit.unsubscribe()
    }
    if (this.subRefTa) {
      this.subRefTa.unsubscribe()
    }
    if (this.subPayment) {
      this.subPayment.unsubscribe()
    }
    if (this.subDialog) {
      this.subDialog.unsubscribe()
    }
    if (this.subRefStatus) {
      this.subRefStatus.unsubscribe()
    }
    this.TravelAgentService.ta = []
  }
  initValueForm(payment) {
    this.form.get('applicant').setValue(payment.applicant)
    this.form.get('contract').setValue(payment.contract)
    this.data = []
    if (payment.rusCount) {
      this.form.get('rusCount').setValue(payment.rusCount)
      this.data.push({ applicant: 'Rus', count: +this.form.get('rusCount').value, cost: (this.price.services.find(cost => cost.value == 'rus').cost + this.price.services.find(cost => cost.value == 'service').cost) })
    }
    if (payment.gratisCount) {
      this.form.get('gratisCount').setValue(payment.gratisCount)
      this.data.push({ applicant: 'Gratis', count: +this.form.get('gratisCount').value, cost: this.price.services.find(cost => cost.value == 'service').cost })
    }
    if (payment.fullGratisCount) {
      this.form.get('fullGratisCount').setValue(payment.fullGratisCount)
      this.data.push({ applicant: 'FullGratis', count: +this.form.get('fullGratisCount').value, cost: 0 })

    }
    if (payment.nonRusCount) {
      this.form.get('nonRusCount').setValue(payment.nonRusCount)
      this.data.push({ applicant: 'NonRus', count: +this.form.get('nonRusCount').value, cost: (this.price.services.find(cost => cost.value == 'nonRus').cost + this.price.services.find(cost => cost.value == 'service').cost) })
    }
    this.dataSource = new MatTableDataSource(this.data)
    if (payment.refNumbers) {
      this.refCount = 0;
      payment.refNumbers.forEach(refNumber => {
        const control = new FormControl(refNumber);
        (this.form.get('refNumbers') as FormArray).push(control)
        this.refCount += +refNumber.count
        this.form.get('refCount').setValue(this.refCount)
      })
    }
    if (payment.nameTa) {
      this.form.get('nameTa').setValue(payment.nameTa)
    }
    if (payment.pers) {
      this.form.get('pers').setValue(payment.pers)
    }
    if (payment.vip) {
      this.form.get('vip').setValue(payment.vip)
    }
    if (payment.photo) {
      this.form.get('photo').setValue(payment.photo)
    }
    if (payment.form) {
      this.form.get('form').setValue(payment.form)
    }
    if (payment.sms) {
      this.form.get('sms').setValue(payment.sms)
    }
    if (payment.copy) {
      this.form.get('copy').setValue(payment.copy)
    }
    if (payment.ppb) {
      this.form.get('ppb').setValue(payment.ppb)
    }
    if (payment.foxValue) {
      this.form.get('foxValue').setValue(payment.foxValue)
      this.displayedColumns = ['applicant', 'count', 'fee', 'foxService', 'foxCost', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
      this.selectedIdxFox = this.price.foxServices.find(foxZone => foxZone.value == payment.foxValue)
    }
    if (payment.foxValue) {
      this.form.get('foxCount').setValue(payment.foxCount)
    }
    if (payment.approve) {
      this.form.disable()
    }
  }
  getTotal() {
    if (this.form.get('foxValue').value) {
      return this.priceValue.foxService * +this.form.get('foxCount').value
    } else {
      return 0
    }
  }
  onSubmit() {
    this.form.disable()
    let sendForm: any = {}
    const keys = Object.keys(this.form.value)
    keys.forEach(key => {
      if (this.form.value[key] != null) {
        sendForm[key] = this.form.value[key]
      }
    })
    let submit: Observable<any>
    if (this.payment) {
      sendForm.id = this.payment._id
      submit = this.paymentService.updateById(sendForm)
    } else {
      submit = this.paymentService.createTa(sendForm).pipe(
        mergeMap((message) => {
          this.loadingRef = true
          this._snackBar.open(message.message, '', {
            duration: 3000
          })
          return this.refNumberService.getAllToday()
        })
      )
    }
    this.subPayment = submit.subscribe(refNumbers => {
      if (this.payment) {
        this._location.back()
      } else {
        this.refNumbers = refNumbers
        this.form.reset()
        this.form.enable()
        this.form.get('foxCount').setValue(0);
        (this.form.get('refNumbers') as FormArray).clear();
        this.selectedIdxFox = null
        this.displayedColumns = ['applicant', 'count', 'fee', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
        this.data = []
        this.dataSource = new MatTableDataSource(this.data)
        this.loadingRef = false
      }

    }, error => {
      this.form.enable();
      this._snackBar.open(error.error.message, '', {
        duration: 3000
      })
    })
  }
  removeRef(id) {
    this.loadingRefStatus = true
    this.loadingRef = true
    let idPayment = {
      idPayment: this.payment._id
    }
    let idRef = {
      idRef: id
    }
    this.subRefStatus = this.paymentService.updateRefStatus(idPayment, idRef).pipe(
      mergeMap((message) => {
        this._snackBar.open(message.message, '', {
          duration: 3000
        })
        return forkJoin([
          this.paymentService.getById(this.payment._id),
          this.refNumberService.getAllToday()
        ])
      })
    ).subscribe(result => {
      if (result[0]) {
        this.payment = result[0];
        (this.form.get('refNumbers') as FormArray).clear();
        this.refCount = 0;
        result[0].refNumbers.forEach(refNumber => {
          const control = new FormControl(refNumber);
          (this.form.get('refNumbers') as FormArray).push(control)
          this.refCount += +refNumber.count

        })
        this.form.get('refCount').setValue(this.refCount)
      }
      this.refNumbers = result[1]
      this.loadingRefStatus = false
      this.loadingRef = false
    }, error => {
      this._snackBar.open(error.error.message, '', {
        duration: 3000
      })
    })
  }
  addFox() {
    if (!this.form.disabled) {
      this.form.get('foxCount').setValue(this.form.value.foxCount + 1)
    }
  }
  delFox() {
    if (!this.form.disabled) {
      if (this.form.get('foxCount').value > 0) {
        this.form.get('foxCount').setValue(this.form.value.foxCount - 1)
      }
    }

  }
  count(event) {
    this.form.get(event.target.id).setValue(this.form.get(event.target.id).value.split(' ').join('').trim().replace(/[^0-9/\s]*/g, ''))
    this.form.get('applicant').setValue(+this.form.get('rusCount').value + +this.form.get('gratisCount').value + +this.form.get('fullGratisCount').value + +this.form.get('nonRusCount').value)
    this.form.get('foxCount').setValue(+this.form.get('applicant').value)
    this.data = []
    if (+this.form.get('rusCount').value > 0) {
      this.data.push({ applicant: 'Rus', count: +this.form.get('rusCount').value, cost: (this.price.services.find(cost => cost.value == 'rus').cost + this.price.services.find(cost => cost.value == 'service').cost) })
    }
    if (+this.form.get('gratisCount').value > 0) {
      this.data.push({ applicant: 'Gratis', count: +this.form.get('gratisCount').value, cost: this.price.services.find(cost => cost.value == 'service').cost })
    }
    if (+this.form.get('fullGratisCount').value > 0) {
      this.data.push({ applicant: 'FullGratis', count: +this.form.get('fullGratisCount').value, cost: 0 })
    }
    if (+this.form.get('nonRusCount').value > 0) {
      this.data.push({ applicant: 'NonRus', count: +this.form.get('nonRusCount').value, cost: (this.price.services.find(cost => cost.value == 'nonRus').cost + this.price.services.find(cost => cost.value == 'service').cost) })
    }
    this.dataSource = new MatTableDataSource(this.data)
  }
  trim(event) {
    this.form.get(event.target.id).setValue(this.form.get(event.target.id).value.split(' ').join('').trim().replace(/[^0-9/\s]*/g, ''))
  }
  openDialog(): void {
    if (!this.form.disabled) {
      const dialogRef = this.dialog.open(CreateRefComponent, {
        width: '600px',
        panelClass: 'myClass',
      })
      this.subDialog = dialogRef.afterClosed()
        .pipe(
          mergeMap(() => {
            this.loadingRef = true
            return this.refNumberService.getAllToday()
          })
        )
        .subscribe((refNumbers) => {
          if (this.payment) {
            this.refCount = 0;
            (this.form.get('refNumbers') as FormArray).clear();
            this.form.get('refCount').setValue(null)
            this.payment.refNumbers.forEach(refNumber => {
              const control = new FormControl(refNumber);
              (this.form.get('refNumbers') as FormArray).push(control)
              this.refCount += +refNumber.count
              this.form.get('refCount').setValue(this.refCount)
            })
            this.refNumbers = refNumbers
            if (this.form.get('nameTa').value) {
              this.refNumbers = this.refNumbers.filter(travelAgents => travelAgents.nameTa == this.form.get('nameTa').value)
            }
            this.loadingRef = false
          } else {
            (this.form.get('refNumbers') as FormArray).clear();
            this.form.get('refCount').setValue(null)
            this.refNumbers = refNumbers
            if (this.form.get('nameTa').value) {
              this.refNumbers = this.refNumbers.filter(travelAgents => travelAgents.nameTa == this.form.get('nameTa').value)
            }
            this.loadingRef = false
          }
        }, error => {
          this._snackBar.open(error.error.message, '', {
            duration: 3000
          })
        });
    }

  }
  select(event: MatSelectionListChange) {
    if (this.payment) {
      this.refCount = 0;
      (this.form.get('refNumbers') as FormArray).clear();
      this.payment.refNumbers.forEach(refNumber => {
        const control = new FormControl(refNumber);
        (this.form.get('refNumbers') as FormArray).push(control)
        this.refCount += +refNumber.count
        this.form.get('refCount').setValue(this.refCount)
      })
      const value: any = event.source._value
      value.forEach(refNumber => {
        const control = new FormControl(refNumber);
        (this.form.get('refNumbers') as FormArray).push(control)
        this.refCount += +refNumber.count
        this.form.get('refCount').setValue(this.refCount)
      })
    } else {
      this.refCount = 0;
      (this.form.get('refNumbers') as FormArray).clear();
      const value: any = event.source._value
      value.forEach(refNumber => {
        const control = new FormControl(refNumber);
        (this.form.get('refNumbers') as FormArray).push(control)
        this.refCount += +refNumber.count
        this.form.get('refCount').setValue(this.refCount)
      })
      if (value.length == 0) {
        this.form.get('refCount').setValue(null)
      }
    }
  }
  selectTa() {
    this.loadingRef = true;
    if (this.payment) {
      this.refCount = 0;
      (this.form.get('refNumbers') as FormArray).clear();
      this.form.get('refCount').setValue(null)
      this.payment.refNumbers.forEach(refNumber => {
        const control = new FormControl(refNumber);
        (this.form.get('refNumbers') as FormArray).push(control)
        this.refCount += +refNumber.count
        this.form.get('refCount').setValue(this.refCount)
      })
      this.subRefTa = this.refNumberService.getAllToday().subscribe(refNumber => {
        this.refNumbers = refNumber
        if (this.form.get('nameTa').value) {
          this.refNumbers = this.refNumbers.filter(travelAgents => travelAgents.nameTa == this.form.get('nameTa').value)
        }
        this.loadingRef = false
      }, error => {
        this._snackBar.open(error.error.message, '', {
          duration: 3000
        })
      })
    } else {
      (this.form.get('refNumbers') as FormArray).clear();
      this.form.get('refCount').setValue(null)
      this.subRefTa = this.refNumberService.getAllToday().subscribe(refNumber => {
        this.refNumbers = refNumber
        if (this.form.get('nameTa').value) {
          this.refNumbers = this.refNumbers.filter(travelAgents => travelAgents.nameTa == this.form.get('nameTa').value)
        }
        this.loadingRef = false
      }, error => {
        this._snackBar.open(error.error.message, '', {
          duration: 3000
        })
      })
    }


  }
  selectFox(event) {
    if (event.value !== null) {
      this.displayedColumns = ['applicant', 'count', 'fee', 'foxService', 'foxCost', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
      this.selectedIdxFox = this.price.foxServices.find(foxZone => foxZone.value == event.value)
    } else {
      this.selectedIdxFox = null
      this.displayedColumns = ['applicant', 'count', 'fee', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
    }
  }
}

