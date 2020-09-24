import { Component, OnInit, OnDestroy } from '@angular/core'
import { Location } from '@angular/common'
import { UserService } from '../../services/user.service'
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { PaymentService } from '../../services/payment.service'
import { WatcherService } from '../../services/watcher.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit, OnDestroy {
  subWatch: Subscription
  urlBread = []
  urls = [
    { url: '/admin/time-tracking', name: 'Учет рабочего времени', badge: false },
    { url: '/admin/news', name: 'Новости', badge: false },
    { url: '/admin/price', name: 'Прайс', badge: false },
    { url: '/admin/admin-panel', name: 'Администрирование', badge: false },
    { url: '/admin/create-payment', name: 'Создать счет IND', badge: false },
    { url: '/admin/create-payment-ta', name: 'Создать счет TA', badge: false },
    { url: '/admin/history', name: 'История счетов' },
    { url: '/admin/create-ta', name: 'Создать TA', badge: false },
    { url: '/admin/cash', name: 'Касса', badge: false }
  ]
  urlsMap = [
    { url: 'news', link: '/admin/news', name: 'Новости' },
    { url: 'price', link: '/admin/price', name: 'Прайс' },
    { url: 'admin-panel', link: '/admin/admin-panel', name: 'Администрирование' },
    { url: 'time-tracking', link: '/admin/time-tracking', name: 'Учет рабочего времени' },
    { url: 'time-tracking?permissionTimeTracking=true', link: '/admin/time-tracking', name: 'Учет рабочего времени' },
    { url: 'create-user', link: 'admin-panel/create-user', name: 'Создать пользователя' },
    { url: 'update-user', link: 'admin-panel/update-user', name: 'Изменить настройки пользователя' },
    { url: 'create-payment', link: "/admin/create-payment", name: 'Создать счет IND' },
    { url: 'create-payment-ta', link: "/admin/create-payment-ta", name: 'Создать счет TA' },
    { url: 'history', link: "/admin/history", name: 'История счетов' },
    { url: 'create-ta', link: "/admin/create-ta", name: 'Создать TA' },
    { url: 'cash', link: "/admin/cash", name: 'Касса' }
  ]

  constructor(private location: Location,
    public userService: UserService,
    private authService: AuthService,
    private router: Router,
    public paymentService: PaymentService,
    private watcher: WatcherService) { }

  ngOnInit(): void {
    this.locationInit()
    this.subWatch = this.watcher.watch('/api/watch').subscribe((data) => {
      if (data.data == 'payment_ta') {
        this.urls.find(url => url.name == 'История счетов').badge = true
      }
      if (data.data == 'payment_ind') {
        this.urls.find(url => url.name == 'История счетов').badge = true
      }
    })

  }
  ngOnDestroy() {
    if (this.subWatch) {
      this.watcher.close()
      this.subWatch.unsubscribe()
    }
  }
  locationInit() {
    let location = this.location.path().split('/')
    location.forEach(url => {
      this.urlsMap.forEach(urlMap => {
        if (url === urlMap.url) {
          this.urlBread.push(urlMap)
        }
      })
    })
    this.location.onUrlChange(url => {
      this.urlBread = []
      let spit = url.split('/')
      spit.forEach(url => {
        this.urlsMap.forEach(urlMap => {
          if (url === urlMap.url) {
            this.urlBread.push(urlMap)
          }
        })
      })
    })
  }
  logout() {
    this.authService.logout()
    this.router.navigate(['/login'])
  }
  clearBadge(event) {
    if (event.target.innerText == 'История счетов') {
      this.urls.find(url => url.name == 'История счетов').badge = false
    }
  }
}
