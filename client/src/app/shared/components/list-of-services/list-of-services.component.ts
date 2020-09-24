import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Price } from '../../interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { from, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-list-of-services',
  templateUrl: './list-of-services.component.html',
  styleUrls: ['./list-of-services.component.css']
})
export class ListOfServicesComponent implements OnInit, OnDestroy, OnChanges {
  subData: Subscription
  subData2: Subscription
  subData3: Subscription
  data = []
  @Input() price: Price
  @Input() formValue
  @Input() formTa

  NAME_OF_SERVICES = {
    rus: "rus",
    gratis: "gratis",
    fullGratis: "fullGratis",
    nonRus: "nonRus",
    service: "service",
    pers: "pers",
    vip: "vip",
    form: "form",
    sms: "sms",
    copy: "copy",
    copy10: "copy10",
    ppb: "ppb",
    photo: "photo",
    foxValue: {
      foxService: 'foxService',
      feVip: 'feVip',
      fe1: 'fe1',
      fe2: 'fe2',
      fe3: 'fe3',
      fe4: 'fe4',
      fe5: 'fe5',
      fe6: 'fe6',
      fe7: 'fe7',
      fe8: 'fe8',
      fe9: 'fe9',
      fe10: 'fe10',
      fe11: 'fe11',
      fe12: 'fe12',
      fe13: 'fe13',
      fe14: 'fe14',
      fe15: 'fe15',
      fevipReg: 'fevipReg',
      fe0: 'fe0'
    }
  }
  displayedColumns: string[] = ['name', 'cost', 'count', 'total']
  dataSource: any = []
  constructor() { }

  ngOnInit(){
    this.data = []
    this.subData = from(this.price.services).pipe(
      filter(value => value.name !== 'Ксерокопия более 10 шт.'),
      map(value => ({ name: value.name, cost: value.cost, count: 0, total: 0, value: value.value }))
    ).subscribe(val => this.data.push(val))
    this.dataSource = new MatTableDataSource(this.data)
  }
  ngOnChanges(changes: SimpleChanges) {
    let change = { ...changes }
    if (change.formValue) {
      if (change.formValue.firstChange == false) {
        let value = change.formValue.currentValue
        this.data.find(service => {
          if (service.value == this.NAME_OF_SERVICES.rus) {
            service.count = value.barcodesRus.length
          }
          if (service.value == this.NAME_OF_SERVICES.nonRus) {
            service.count = value.barcodesNonRus.length
          }
          if (service.value == this.NAME_OF_SERVICES.service) {
            service.count = value.barcodesRus.length + value.barcodesNonRus.length + value.barcodesGratis.length
          }
          if (service.value == this.NAME_OF_SERVICES.pers) {
            service.count = value.pers
          }
          if (service.value == this.NAME_OF_SERVICES.vip) {
            service.count = value.vip
          }
          if (service.value == this.NAME_OF_SERVICES.form) {
            service.count = value.form
          }
          if (service.value == this.NAME_OF_SERVICES.sms) {
            service.count = value.sms
          }
          if (service.value == this.NAME_OF_SERVICES.copy) {
            if (value.copy > 10) {
              service.name = "Ксерокопия более 10 шт."
              service.count = value.copy
              service.cost = this.price.services.find(copy => copy.value == this.NAME_OF_SERVICES.copy10).cost

            }
            if (value.copy <= 10) {
              service.name = "Ксерокопия"
              service.count = value.copy
              service.cost = this.price.services.find(copy => copy.value == this.NAME_OF_SERVICES.copy).cost
            }
          }
          if (service.value == this.NAME_OF_SERVICES.ppb) {
            service.count = value.ppb
          }
          if (service.value == this.NAME_OF_SERVICES.photo) {
            service.count = value.photo
          }
          if (service.value == this.NAME_OF_SERVICES.photo) {
            service.count = value.photo
          }
        })
        if (value.foxValue != null) {
          if (this.data.find(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService)) {
            this.data.splice(this.data.findIndex(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService), 2)
          }
          this.price.foxServices.find(foxValue => {
            if (foxValue.value == value.foxValue) {
              let foxService = this.price.foxServices.find(foxService => foxService.value == this.NAME_OF_SERVICES.foxValue.foxService)
              this.data.push({ name: foxService.name, cost: foxService.cost, count: value.foxCount, total: 0, value: this.NAME_OF_SERVICES.foxValue.foxService })
              this.data.push({ name: foxValue.name, cost: foxValue.cost, count: value.foxCount, total: 0, value: foxValue.value })
            }
          })
        }
        if (value.foxValue == null) {
          if (this.data.find(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService)) {
            this.data.splice(this.data.findIndex(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService), 2)
          }
        }

      }
      this.dataSource = new MatTableDataSource(this.data)
    }
    if (change.formTa) {
      if (change.formTa.firstChange == false) {
        let value = change.formTa.currentValue
        this.data.find(service => {
          if (service.value == this.NAME_OF_SERVICES.rus) {
            service.count = +value.rusCount
          }
          if (service.value == this.NAME_OF_SERVICES.nonRus) {
            service.count = +value.nonRusCount
          }
          if (service.value == this.NAME_OF_SERVICES.service) {
            service.count = +value.rusCount + +value.nonRusCount + +value.gratisCount
          }
          if (service.value == this.NAME_OF_SERVICES.pers) {
            service.count = +value.pers
          }
          if (service.value == this.NAME_OF_SERVICES.vip) {
            service.count = +value.vip
          }
          if (service.value == this.NAME_OF_SERVICES.form) {
            service.count = +value.form
          }
          if (service.value == this.NAME_OF_SERVICES.sms) {
            service.count = +value.sms
          }
          if (service.value == this.NAME_OF_SERVICES.copy) {
            if (value.copy > 10) {
              service.name = "Ксерокопия более 10 шт."
              service.count = +value.copy
              service.cost = this.price.services.find(copy => copy.value == this.NAME_OF_SERVICES.copy10).cost

            }
            if (value.copy <= 10) {
              service.name = "Ксерокопия"
              service.count = +value.copy
              service.cost = this.price.services.find(copy => copy.value == this.NAME_OF_SERVICES.copy).cost
            }
          }
          if (service.value == this.NAME_OF_SERVICES.ppb) {
            service.count = +value.ppb
          }
          if (service.value == this.NAME_OF_SERVICES.photo) {
            service.count = +value.photo
          }
          if (service.value == this.NAME_OF_SERVICES.photo) {
            service.count = +value.photo
          }
        })
        if (value.foxValue != null) {
          if (this.data.find(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService)) {
            this.data.splice(this.data.findIndex(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService), 2)
          }
          this.price.foxServices.find(foxValue => {
            if (foxValue.value == value.foxValue) {
              let foxService = this.price.foxServices.find(foxService => foxService.value == this.NAME_OF_SERVICES.foxValue.foxService)
              this.data.push({ name: foxService.name, cost: foxService.cost, count: value.foxCount, total: 0, value: this.NAME_OF_SERVICES.foxValue.foxService })
              this.data.push({ name: foxValue.name, cost: foxValue.cost, count: value.foxCount, total: 0, value: foxValue.value })
            }
          })
        }
        if (value.foxValue == null) {
          if (this.data.find(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService)) {
            this.data.splice(this.data.findIndex(foxValue => foxValue.value == this.NAME_OF_SERVICES.foxValue.foxService), 2)
          }
        }

      }
      this.dataSource = new MatTableDataSource(this.data)
    }

  }
  ngOnDestroy() {
    if (this.subData) {
      this.subData.unsubscribe()
    }
  }

}
