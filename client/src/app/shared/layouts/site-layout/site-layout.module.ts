import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule, Routes, PreloadAllModules } from '@angular/router'
import { SiteLayoutComponent } from './site-layout.component'
import { MaterialModule } from './material.module'

const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent, children: [
      { path: '', redirectTo: '/main/news', pathMatch: 'full' },
      { path: 'news', loadChildren: () => import('../../../news-page/news-page.module').then(m => m.NewsPageModule) },
      { path: 'price', loadChildren: () => import('../../../price-page/price-page.module').then(m => m.PricePageModule) }
    ]
  }
]

@NgModule({
  declarations: [SiteLayoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule
  ]
})
export class SiteLayoutModule { }
