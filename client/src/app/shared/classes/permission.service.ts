import { NgxPermissionsService } from 'ngx-permissions';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';


export function permissionService(http?: HttpClient, permissionService?: NgxPermissionsService, router?: Router) {
  return () => {
    const candidateToken = localStorage.getItem('auth-token')
    if (candidateToken !== null) {
      const httpOptions = { headers: new HttpHeaders({ 'Authorization': candidateToken }) }
      return http.get('/api/auth/role', httpOptions).toPromise().then((user: any) => {
        if (user.role == 'ADMIN') {
          permissionService.addPermission(user.role)
          if (user.isCheckIn == true) {
            permissionService.addPermission([user.role,'checkInAdmin'])
          }
        }
        if (user.role == 'USER') {
          permissionService.addPermission(user.role)
          if (user.isCheckIn == true) {
            permissionService.addPermission([user.role,'checkInUser'])
          }
        }
      }).catch(e => {
        if (e.status === 401) {
          router.navigate(['/login'], {
            queryParams: {
              sessionFailed: true
            }
          })
        }
      })
    } else {
      return false
    }

  }
}






