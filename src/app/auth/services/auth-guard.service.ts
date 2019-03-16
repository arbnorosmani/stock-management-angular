import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";

import {take, map, catchError} from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/index";

import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from "../../../environments/environment";
import * as AuthActions from '../store/auth.actions';

@Injectable()
export class AuthGuard implements CanActivate{
    /**
     * @type {boolean}
     */
    check: boolean = false;

    /**
     * @constructor
     *
     * @param {Store} store
     * @param {Router} router
     * @param {HttpClient} httpClient
     */
    constructor(
        private store: Store<any>,
        private router: Router,
        private httpClient: HttpClient,
    ){

    }

    /**
     * Check if user has access to activate route
     * By implementing this guard, all route permission are denied unless user is authenticated.
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     *
     * @returns {Observable<boolean> | boolean}
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean{
        let checkAuth = false;

         // Get auth data from ngRx
        this.store.select('auth')
            .pipe(take(1))
            .subscribe(
              (authSate) => {
                    if(authSate.authenticated){
                        checkAuth = true;
                    }
                }
            );

        if(checkAuth){
            return true;
        }

        // Send request to check if user is logged in
        return this.httpClient.get(environment.apiURL+'/auth/check')
            .pipe(
                map(
                    (response) => {
                        if(response['status'] == false){
                            this.router.navigate(['/login']);
                            return false;
                        }else{
                            this.store.dispatch(new AuthActions.Signin(localStorage.getItem('access_token')));
                            this.store.dispatch(new AuthActions.SetAuthUser(response['user']));
                            return true;
                        }
                    }
                ),
                catchError(
                    (error) => {
                        this.router.navigate(['/login']);
                        return Observable.throw(error);
                    }
                )
            );
    }
}
