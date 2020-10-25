import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('aliceuser')) {
            console.log('login olmali')
            return true;
        }
else{
        // not logged in so redirect to login page with the return url
        console.log('login olmali')
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
}
    }
}
