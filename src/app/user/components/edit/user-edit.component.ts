import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { SharedService } from '../../../shared/services/shared.service';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit, OnDestroy {

    userForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    id: number;
 
    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {FormBuilder} _formBuilder
     * @param {Title} _titleService
     * @param {SharedService} _sharedService
     * @param {Router} router
     * @param {ActivatedRoute} route
     */
    constructor(
        private httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _titleService: Title,
        private _sharedService: SharedService,
        private router: Router,
        private route: ActivatedRoute
    )
    {
        this._titleService.setTitle( 'Profile' );
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.userForm = this._formBuilder.group({
            name : ['', Validators.required],
            email : ['', [ Validators.required, Validators.email] ],
            country : [''],
            city : [''],
            phone : [''],
            address : [''],
            // password: ['', [Validators.required, Validators.minLength(6)]],
            // password_confirmation: ['', [Validators.required, Validators.minLength(6), confirmPasswordValidator] ]
        }); 

        
        // Send request to get user by id
        this.httpClient.get(environment.apiURL+'/users/'+this.id)
        .pipe(
            takeUntil(this._unsubscribeAll),
            map (
                (response) =>{
                    if(response['success']){
                        let user = response['user'];

                        this.userForm.patchValue({
                            name : user['name'],
                            email : user['email'],
                            country : user['country'],
                            city : user['city'],
                            phone : user['phone'],
                            address : user['address'],
                        });
                    }else{
                        this._sharedService.openSnackBar('There was a problem loading user data.', 'X', 'error', 15000);
                    }
                }
            ),
            catchError(
                (error) => {
                    this._sharedService.openSnackBar('There was a problem while updating this user.', 'X', 'error', 15000);
                    return Observable.throw(error);
                }
            )
        )
        .subscribe();
    }

    /**
    * On Destroy
    */
    ngOnDestroy() {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Submit form data to API
     */
    onSubmit(){
        if(this.userForm.valid){
            let data = this.userForm.value;
            data.id = this.id;

            // Send request to update user
            this.httpClient.post(environment.apiURL+'/users/update', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            if(response['success']){
                                this._sharedService.openSnackBar('User updated successfully.', 'X', 'success');
                            }else{
                                let errors = response['errors'];
                                this._sharedService.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 15000);
                            }
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while adding this user.', 'X', 'error', 15000);
                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }
    }

}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const password_confirmation = control.parent.get('password_confirmation');

    if ( !password || !password_confirmation )
    {
        return null;
    }

    if ( password_confirmation.value === '' )
    {
        return null;
    }

    if ( password.value === password_confirmation.value )
    {
        return null;
    }

    return {'passwordsNotMatching': true};
};