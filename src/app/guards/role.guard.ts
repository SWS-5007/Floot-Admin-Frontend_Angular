import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/identity/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {


      if(this.authService.getAuthenticationState().isAuthenticated) {

        if (this.authService.account === null) {

          if (route.data.roles as number >= this.authService.getAuthenticationState().role) {
            return true;

          } else {
            // this.router.navigate(['/planner'])
            return false;
          }

        } else {

          if (route.data.roles as number >= this.authService.account.role) {
            return true;

          } else {
            // this.router.navigate(['/planner'])
            return false;
          }
        }


      }
      else {
        // this.router.navigate(['/authentication/sign-in'])
        return false;
      }

    }

}
