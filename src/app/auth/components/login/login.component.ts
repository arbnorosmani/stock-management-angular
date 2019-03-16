import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../store/auth.actions';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";

import { SharedService } from '../../../shared/services/shared.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    private _unsubscribeAll: Subject<any>; 

    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {FormBuilder} _formBuilder
     * @param {Title} _titleService
     * @param {Store} store
     * @param {Router} router
     * @param {SharedService} _sharedService
     */
    constructor(
        private httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _titleService: Title,
        private store: Store<any>,
        private router: Router,
        private _sharedService: SharedService
    )
    {
        this._titleService.setTitle( 'Login' );
        this._unsubscribeAll = new Subject();
    }

  	/**
     * On init
     */
    ngOnInit() {
        this.loginForm = this._formBuilder.group({
            password : ['', Validators.required],
            email : ['arbnori.osmani@gmail.com', [ Validators.required, Validators.email] ]
        });
    }

    /**
    * On Destroy
     *
     * Remove all subscriptions
    * */
    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Check login credentials
     */
    onSubmit(){
        let data = this.loginForm.value;
        if(this.loginForm.valid){

            // Send request to check login credentials
            this.httpClient.post(environment.apiURL+'/auth/login', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            this.store.dispatch(new AuthActions.Signin(response['access_token']));
                            this.store.dispatch(new AuthActions.SetAuthUser(response['user']));
                            this.router.navigate(['/dashboard']);
                            localStorage.setItem('access_token', response['access_token']);
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('These credentials do not match our records.', 'X', 'error', 15000);
                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }
    }

}
