import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as SharedActions from '../../../shared/store/shared.actions';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { SharedService } from '../../../shared/services/shared.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

    profileForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    user = { name: '', email: '', country: '', city: '', phone: '', address: ''};

    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {FormBuilder} _formBuilder
     * @param {Title} _titleService
     * @param {Store} store
     * @param {SharedService} _sharedService
     */
    constructor(
        private httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _titleService: Title,
        private store: Store<any>,
        private _sharedService: SharedService
    )
    {
        this._titleService.setTitle( 'Profile' );
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.store.select(state => state)
            .subscribe(
                (data) => {
                    this.user = data['auth']['authUser'];
                }
            );

        this.profileForm = this._formBuilder.group({
            name : [this.user.name, Validators.required],
            email : [this.user.email, [ Validators.required, Validators.email] ],
            country : [this.user.country],
            city : [this.user.city],
            phone : [this.user.phone],
            address : [this.user.address],
        });       
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
        if(this.profileForm.valid){
            let data = this.profileForm.value;
            this.store.dispatch(new SharedActions.SetIsLoading(true));

            // Send request to check login credentials
            this.httpClient.post(environment.apiURL+'/profile', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                                this._sharedService.openSnackBar('Profile updated successfully.', 'X', 'success');
                                this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('Profile not updated.', 'X', 'error', 15000);
                            this.store.dispatch(new SharedActions.SetIsLoading(false));

                            return Observable.throw(error);
                        }
                    )
                    )
                    .subscribe();
        }
    }

}
