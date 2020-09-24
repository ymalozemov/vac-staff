import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MaterialModule } from './material.module'
import { Routes, RouterModule } from '@angular/router'
import { AdminLayoutComponent } from './admin-layout.component'

const routes: Routes = [
  {
    path: '', component: AdminLayoutComponent, children: [
      { path: '', redirectTo: '/admin/time-tracking', pathMatch: 'full' },
      { path: 'news', loadChildren: () => import('../../../news-page/news-page.module').then(m => m.NewsPageModule) },
      { path: 'price', loadChildren: () => import('../../../price-page/price-page.module').then(m => m.PricePageModule) },
      { path: 'time-tracking', loadChildren: () => import('../../../time-tracking-page/time-tracking-page.module').then(m => m.TimeTrackingPageModule) },
      { path: 'admin-panel', loadChildren: () => import('../../../admin-panel-page/admin-panel-page.module').then(m => m.AdminPanelPageModule) },
      { path: 'admin-panel/create-user', loadChildren: () => import('../../../create-user-page/create-user-page.module').then(m => m.CreateUserPageModule) },
      { path: 'admin-panel/update-user', loadChildren: () => import('../../../update-user-page/update-user-page.module').then(m => m.UpdateUserPageModule) },
      { path: 'admin-panel/update-user/:id', loadChildren: () => import('../../../update-user-page/update-user-form/update-user-form.module').then(m => m.UpdateUserFormModule) },
      { path: 'create-payment', loadChildren: () => import('../../../create-payment-page/create-payment-page.module').then(m => m.CreatePaymentPageModule) },
      { path: 'create-payment-ta', loadChildren: () => import('../../../create-payment-ta-page/create-payment-ta-page.module').then(m => m.CreatePaymentTaPageModule) },
      { path: 'create-ta', loadChildren: () => import('../../../create-ta-page/create-ta-page.module').then(m => m.CreateTaPageModule) },
      { path: 'cash', loadChildren: () => import('../../../cash-page/cash-page.module').then(m => m.CashPageModule) },
      { path: 'cash/:id', loadChildren: () => import('../../../cash-page/payment-info/payment-info.module').then(m => m.PaymentInfoModule) },
      { path: 'history', loadChildren: () => import('../../../history-page/history-page.module').then(m => m.HistoryPageModule) },
      { path: 'history/ind/:id', loadChildren: () => import('../../../create-payment-page/create-payment-page.module').then(m => m.CreatePaymentPageModule) },
      { path: 'history/ta/:id', loadChildren: () => import('../../../create-payment-ta-page/create-payment-ta-page.module').then(m => m.CreatePaymentTaPageModule) }
    ]
  }
]

@NgModule({
  declarations: [
    AdminLayoutComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ]
})
export class AdminLayoutModule { }
