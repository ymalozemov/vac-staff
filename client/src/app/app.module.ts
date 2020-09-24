import { BrowserModule } from '@angular/platform-browser'
import { NgModule, APP_INITIALIZER } from '@angular/core'
import { Router } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClientXsrfModule, HttpClient } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { TokenInterceptor } from './shared/classes/token.interceptor'

import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions'
import { permissionService } from './shared/classes/permission.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'XSRF-TOKEN',
    }),
    BrowserAnimationsModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: permissionService,
      multi: true,
      deps: [HttpClient, NgxPermissionsService, Router]
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: TokenInterceptor
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
