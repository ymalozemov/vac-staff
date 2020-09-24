import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormGroup, Validators, FormControl, FormGroupDirective, NgForm, FormArray } from '@angular/forms'
import { ErrorStateMatcher } from '@angular/material/core'
import { PriceService } from '../shared/services/price.service'
import { Subscription, forkJoin, Observable } from 'rxjs'
import { Price } from '../shared/interfaces'
import { MatSnackBar } from '@angular/material/snack-bar'
import { mergeMap } from 'rxjs/operators'
import { MatTableDataSource } from '@angular/material/table'
import { MyValidators } from './my.validators'
import { PaymentService } from '../shared/services/payment.service'
import { ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common'

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted
    return !!(control && control.invalid && control.touched)
  }
}

@Component({
  selector: 'app-create-payment-page',
  templateUrl: './create-payment-page.component.html',
  styleUrls: ['./create-payment-page.component.css']
})

export class CreatePaymentPageComponent implements OnInit, OnDestroy {

  subPayment: Subscription
  subInit: Subscription
  price: Price
  payment: any
  priceValue: any = {}
  form: FormGroup
  loading = false
  barcodesRus = []
  barcodesRusCost = 0
  barcodesGratis = []
  barcodesGratisCost = 0
  barcodesFullGratis = []
  barcodesFullGratisCost = 0
  barcodesNonRus = []
  barcodesNonRusCost = 0
  foxes = []
  selectedIdxFox = null
  dataSource: any = []
  data = []
  displayedColumns = ['applicant', 'count', 'fee', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
  matcher = new MyErrorStateMatcher();
  constructor(
    private priceService: PriceService,
    private _snackBar: MatSnackBar,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private _location: Location
  ) { }

  ngOnInit() {

    this.loading = true
    this.form = new FormGroup({
      applicant: new FormControl(null, [Validators.required]),
      contract: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]),
      barcodesRus: new FormArray([], [MyValidators.requiredBarcodes, MyValidators.minLengthBarcodes, MyValidators.maxLengthBarcodes]),
      barcodesGratis: new FormArray([], [MyValidators.requiredBarcodes, MyValidators.minLengthBarcodes, MyValidators.maxLengthBarcodes]),
      barcodesFullGratis: new FormArray([], [MyValidators.requiredBarcodes, MyValidators.minLengthBarcodes, MyValidators.maxLengthBarcodes]),
      barcodesNonRus: new FormArray([], [MyValidators.requiredBarcodes, MyValidators.minLengthBarcodes, MyValidators.maxLengthBarcodes]),
      foxCount: new FormControl(0),
      foxValue: new FormControl(null),
      copy: new FormControl(null),
      form: new FormControl(null),
      photo: new FormControl(null),
      sms: new FormControl(null),
      vip: new FormControl(null),
      pers: new FormControl(null),
      ppb: new FormControl(null)
    }, [
      MyValidators.formValidador,
      MyValidators.hasBarcodes,
      MyValidators.ppbFoxCount,
      MyValidators.ppbCount,
      MyValidators.foxCount,
      MyValidators.persCount,
      MyValidators.smsCount,
      MyValidators.vipCount,
      MyValidators.formCount,
      MyValidators.photoCount
    ])
    this.subInit = this.route.params.pipe(
      mergeMap(data => {
        let forkAr = [
          this.priceService.getAll()
        ]
        if (data.id) {
          forkAr.push(this.paymentService.getById(data.id))
        }
        return forkJoin(forkAr)
      })
    ).subscribe(data => {
      this.price = data[0]
      this.price.services.forEach(value => {
        Object.assign(this.priceValue, { [value.value]: value.cost })
      })
      this.price.foxServices.forEach(value => {
        Object.assign(this.priceValue, { [value.value]: value.cost })
      })
      this.foxes = this.price.foxServices.filter(value => value.value !== 'foxService')
      if (data[1]) {
        this.payment = data[1]
        this.initValueForm(data[1])
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
    if (this.subPayment) {
      this.subPayment.unsubscribe()
    }
  }
  getTotal() {
    if (this.form.get('foxValue').value) {
      return this.priceValue.foxService * +this.form.get('foxCount').value
    } else {
      return 0
    }
  }
  initValueForm(payment) {
    this.form.get('applicant').setValue(payment.applicant)
    this.form.get('contract').setValue(payment.contract)
    let barcodesRus = []
    let barcodesGratis = []
    let barcodesFullGratis = []
    let barcodesNonRus = []
    payment.barcodes.find(barcode => {
      if (barcode.fee == 'rus') {
        barcodesRus.push(barcode)
      }
      if (barcode.fee == 'gratis') {
        barcodesGratis.push(barcode)
      }
      if (barcode.fee == 'fullGratis') {
        barcodesFullGratis.push(barcode)
      }
      if (barcode.fee == 'nonRus') {
        barcodesNonRus.push(barcode)
      }
    })
    if (barcodesRus.length > 0) {
      barcodesRus.forEach(value => {
        let barcode = new FormControl(value.value, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
        (<FormArray>this.form.get('barcodesRus')).push(barcode);
        this.barcodesRus.push(barcode)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        let cost = this.price.services.find(cost => cost.value == 'rus').cost + this.price.services.find(cost => cost.value == 'service').cost
        this.newMatTableRow('RUS', this.form.value.barcodesRus.length, cost)
        this.barcodesRusCost = cost
      })
    }
    if (barcodesGratis.length > 0) {
      barcodesGratis.forEach(value => {
        let barcode = new FormControl(value.value, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
        (<FormArray>this.form.get('barcodesGratis')).push(barcode);
        this.barcodesGratis.push(barcode)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        let cost = this.price.services.find(cost => cost.value == 'service').cost
        this.newMatTableRow('Gratis', this.form.value.barcodesGratis.length, cost)
        this.barcodesGratisCost = cost
      })
    }
    if (barcodesFullGratis.length > 0) {
      barcodesFullGratis.forEach(value => {
        let barcode = new FormControl(value.value, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
        (<FormArray>this.form.get('barcodesFullGratis')).push(barcode);
        this.barcodesFullGratis.push(barcode)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        let cost = 0
        this.newMatTableRow('FullGratis', this.form.value.barcodesFullGratis.length, cost)
        this.barcodesFullGratisCost = cost
      })
    }
    if (barcodesNonRus.length > 0) {
      barcodesNonRus.forEach(value => {
        let barcode = new FormControl(value.value, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
        (<FormArray>this.form.get('barcodesNonRus')).push(barcode);
        this.barcodesNonRus.push(barcode)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        let cost = this.price.services.find(cost => cost.value == 'nonRus').cost + this.price.services.find(cost => cost.value == 'service').cost
        this.newMatTableRow('NonRus', this.form.value.barcodesNonRus.length, cost)
        this.barcodesNonRusCost = cost
      })
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
  onSubmit() {
    this.form.disable()
    let sendForm: any = {
      barcodes: []
    }
    let barcodesValue = []
    let same = []
    if (this.form.get('barcodesRus').value.length > 0) {
      this.form.get('barcodesRus').value.forEach(barcode => {
        sendForm.barcodes.push({ value: barcode, fee: 'rus' })
        barcodesValue.push(barcode)
      })
    }
    if (this.form.get('barcodesGratis').value.length > 0) {
      this.form.get('barcodesGratis').value.forEach(barcode => {
        sendForm.barcodes.push({ value: barcode, fee: 'gratis' })
        barcodesValue.push(barcode)
      })
    }
    if (this.form.get('barcodesFullGratis').value.length > 0) {
      this.form.get('barcodesFullGratis').value.forEach(barcode => {
        sendForm.barcodes.push({ value: barcode, fee: 'fullGratis' })
        barcodesValue.push(barcode)
      })
    }
    if (this.form.get('barcodesNonRus').value.length > 0) {
      this.form.get('barcodesNonRus').value.forEach(barcode => {
        sendForm.barcodes.push({ value: barcode, fee: 'nonRus' })
        barcodesValue.push(barcode)
      })
    }
    same = barcodesValue.filter(function (elem, pos, arr) {
      return pos !== arr.indexOf(elem) || pos !== arr.lastIndexOf(elem);
    })
    if (same.length > 0) {
      same.forEach(message => {
        this._snackBar.open(`Вы ввели одинаковые баркоды ${message}`, '', {
          duration: 3000
        })
      })
      this.form.enable()
    } else {
      if (this.form.get('copy').value != null && this.form.get('copy').value > 0) {
        sendForm.copy = this.form.get('copy').value
      }
      if (this.form.get('form').value != null && this.form.get('form').value > 0) {
        sendForm.form = this.form.get('form').value
      }
      if (this.form.get('foxCount').value != null && this.form.get('foxCount').value > 0 && this.form.get('foxValue').value != null) {
        sendForm.foxCount = this.form.get('foxCount').value
      }
      if (this.form.get('foxValue').value != null) {
        sendForm.foxValue = this.form.get('foxValue').value
      }
      if (this.form.get('pers').value != null && this.form.get('pers').value > 0) {
        sendForm.pers = this.form.get('pers').value
      }
      if (this.form.get('photo').value != null && this.form.get('photo').value > 0) {
        sendForm.photo = this.form.get('photo').value
      }
      if (this.form.get('ppb').value != null && this.form.get('ppb').value > 0) {
        sendForm.ppb = this.form.get('ppb').value
      }
      if (this.form.get('sms').value != null && this.form.get('sms').value > 0) {
        sendForm.sms = this.form.get('sms').value
      }
      if (this.form.get('vip').value !== null && this.form.get('vip').value > 0) {
        sendForm.vip = this.form.get('vip').value
      }
      sendForm.contract = this.form.value.contract
      sendForm.applicant = this.form.value.applicant
      let submit: Observable<any>
      if (this.payment) {
        sendForm.id = this.payment._id
        submit = this.paymentService.updateById(sendForm)
      } else {
        submit = this.paymentService.create(sendForm)
      }
      this.subPayment = submit.subscribe((res) => {
        this._snackBar.open(res.message, '', {
          duration: 3000
        })
        if (this.payment) {
          this._location.back()
        } else {
          this.form.enable();
          (this.form.get('barcodesRus') as FormArray).clear();
          (this.form.get('barcodesNonRus') as FormArray).clear();
          (this.form.get('barcodesGratis') as FormArray).clear();
          (this.form.get('barcodesFullGratis') as FormArray).clear();
          this.form.reset()
          this.form.get('foxCount').setValue(0)
          this.barcodesRus = []
          this.barcodesGratis = []
          this.barcodesFullGratis = []
          this.barcodesNonRus = []
          this.selectedIdxFox = null
          this.displayedColumns = ['applicant', 'count', 'fee', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
          this.data = []
          this.dataSource = new MatTableDataSource(this.data)
        }
      }, error => {
        this._snackBar.open(error.error.message, '', {
          duration: 3000
        })
        this.form.enable()
      })
    }
  }
  newMatTableRow(value, count, cost) {
    if (this.data.find(fee => fee.applicant == value)) {
      this.data.find(fee => fee.applicant == value).count = count
      this.data.find(fee => fee.applicant == value).cost = cost
    } else {
      this.data.push({ applicant: value, count: count, cost: cost })
    }
    this.dataSource = new MatTableDataSource(this.data)
  }
  delMatTableRow(value, count) {
    if (this.data.find(fee => fee.applicant == value)) {
      if (this.data.find(fee => fee.applicant == value).count > 1) {
        this.data.find(fee => fee.applicant == value).count = count
      } else {
        this.data.splice(this.data.findIndex(fee => fee.applicant == value), 1)
      }
    }
    this.dataSource = new MatTableDataSource(this.data)
  }
  addRus() {
    if (!this.form.disabled) {
      let barcode = new FormControl(null, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
      (<FormArray>this.form.get('barcodesRus')).push(barcode);
      this.barcodesRus.push(barcode)
      let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
      this.form.get('foxCount').setValue(count)
      let cost = this.price.services.find(cost => cost.value == 'rus').cost + this.price.services.find(cost => cost.value == 'service').cost
      this.newMatTableRow('RUS', this.form.value.barcodesRus.length, cost)
      this.barcodesRusCost = cost
    }

  }
  delRus() {
    if (!this.form.disabled) {
      let formArrayIdx = (<FormArray>this.form.get('barcodesRus')).length - 1;
      if (formArrayIdx >= 0) {
        (<FormArray>this.form.get('barcodesRus')).removeAt(formArrayIdx)
        this.barcodesRus.splice(formArrayIdx, 1)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        this.delMatTableRow('RUS', this.form.value.barcodesRus.length)
      }
    }

  }
  addGratis() {
    if (!this.form.disabled) {
      let barcode = new FormControl(null, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
      (<FormArray>this.form.get('barcodesGratis')).push(barcode);
      this.barcodesGratis.push(barcode)
      let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
      this.form.get('foxCount').setValue(count)
      let cost = this.price.services.find(cost => cost.value == 'service').cost
      this.newMatTableRow('Gratis', this.form.value.barcodesGratis.length, cost)
      this.barcodesGratisCost = cost
    }

  }
  delGratis() {
    if (!this.form.disabled) {
      let formArrayIdx = (<FormArray>this.form.get('barcodesGratis')).length - 1;
      if (formArrayIdx >= 0) {
        (<FormArray>this.form.get('barcodesGratis')).removeAt(formArrayIdx)
        this.barcodesGratis.splice(formArrayIdx, 1)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        this.delMatTableRow('Gratis', this.form.value.barcodesGratis.length)
      }
    }

  }
  addFullGratis() {
    if (!this.form.disabled) {
      let barcode = new FormControl(null, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
      (<FormArray>this.form.get('barcodesFullGratis')).push(barcode);
      this.barcodesFullGratis.push(barcode)
      let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
      this.form.get('foxCount').setValue(count)
      let cost = 0
      this.newMatTableRow('FullGratis', this.form.value.barcodesFullGratis.length, cost)
      this.barcodesFullGratisCost = cost
    }

  }
  delFullGratis() {
    if (!this.form.disabled) {
      let formArrayIdx = (<FormArray>this.form.get('barcodesFullGratis')).length - 1;
      if (formArrayIdx >= 0) {
        (<FormArray>this.form.get('barcodesFullGratis')).removeAt(formArrayIdx)
        this.barcodesFullGratis.splice(formArrayIdx, 1)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        this.delMatTableRow('FullGratis', this.form.value.barcodesFullGratis.length)

      }
    }
  }
  addNonRus() {
    if (!this.form.disabled) {
      let barcode = new FormControl(null, [Validators.required, Validators.maxLength(9), Validators.minLength(9)]);
      (<FormArray>this.form.get('barcodesNonRus')).push(barcode);
      this.barcodesNonRus.push(barcode)
      let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
      this.form.get('foxCount').setValue(count)
      let cost = this.price.services.find(cost => cost.value == 'nonRus').cost + this.price.services.find(cost => cost.value == 'service').cost
      this.newMatTableRow('NonRus', this.form.value.barcodesNonRus.length, cost)
      this.barcodesNonRusCost = cost
    }
  }
  delNonRus() {
    if (!this.form.disabled) {
      let formArrayIdx = (<FormArray>this.form.get('barcodesNonRus')).length - 1;
      if (formArrayIdx >= 0) {
        (<FormArray>this.form.get('barcodesNonRus')).removeAt(formArrayIdx)
        this.barcodesNonRus.splice(formArrayIdx, 1)
        let count = this.form.value.barcodesRus.length + this.form.value.barcodesGratis.length + this.form.value.barcodesFullGratis.length + this.form.value.barcodesNonRus.length
        this.form.get('foxCount').setValue(count)
        this.delMatTableRow('NonRus', this.form.value.barcodesNonRus.length)
      }
    }
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
  select(event) {
    if (event.value !== null) {
      this.displayedColumns = ['applicant', 'count', 'fee', 'foxService', 'foxCost', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
      this.selectedIdxFox = this.price.foxServices.find(foxZone => foxZone.value == event.value)
    } else {
      this.selectedIdxFox = null
      this.displayedColumns = ['applicant', 'count', 'fee', 'pers', 'vip', 'photo', 'form', 'sms', 'copy', 'ppb', 'total']
    }
  }
}
