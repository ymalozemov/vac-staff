import { Component, OnInit, OnDestroy } from '@angular/core';
import { PriceService } from '../shared/services/price.service';
import { Price } from '../shared/interfaces';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { FormGroup, FormControl } from '@angular/forms';




@Component({
  selector: 'app-price-page',
  templateUrl: './price-page.component.html',
  styleUrls: ['./price-page.component.css']
})
export class PricePageComponent implements OnInit, OnDestroy {
  subPrice: Subscription
  subService: Subscription
  subFox: Subscription
  loading = false
  price: Price
  formService: FormGroup
  formFox: FormGroup
  displayedColumns: string[] = ['name', 'cost'];
  dataSourceService: any = []
  dataSourceFox: any = []
  constructor(private priceService: PriceService, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.formService = new FormGroup({})
    this.formFox = new FormGroup({})
    this.loading = true
    this.subPrice = this.priceService.getAll().subscribe((price) => {
      this.price = price
      this.price.services.forEach(s => {
        this.formService.addControl(s.value, new FormControl(s.cost))
      })
      this.price.foxServices.forEach(s => {
        this.formFox.addControl(s.value, new FormControl(s.cost))
      })
      this.dataSourceService = new MatTableDataSource(this.price.services)
      this.dataSourceFox = new MatTableDataSource(this.price.foxServices)
      this.loading = false
    }, error => {
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
      this.loading = false
    })



  }
  ngOnDestroy() {
    if (this.subPrice) {
      this.subPrice.unsubscribe()
    }
    if (this.subService) {
      this.subService.unsubscribe()
    }
    if (this.subFox) {
      this.subFox.unsubscribe()
    }
  }
  onSubmitService() {
    this.loading = true
    this.price.services.forEach(s => {
      s.cost = this.formService.get(s.value).value
    })
    this.subService = this.priceService.update(this.price).subscribe((message) => {
      this.loading = false
      this._snackBar.open(message.message, 'Закрыть', {
        duration: 3000
      })
    }, error => {
      this.loading = false
      this._snackBar.open(error.error.message, 'Закрыть', {
        duration: 3000
      })
    })
  }
  onSubmitFox() {
    this.loading = true
    this.price.foxServices.forEach(s => {
      s.cost = this.formFox.get(s.value).value
    })
    this.subFox = this.priceService.update(this.price).subscribe((message) => {
      this.loading = false
      this._snackBar.open(message.message, '', {
        duration: 3000
      })
    }, error => {
      this.loading = false
      this._snackBar.open(error.error.message, '', {
        duration: 3000
      })
    })
  }
}
