import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { SharedService } from '../../../shared/services/shared.service';
import { environment } from '../../../../environments/environment';
import { currencies as availableCurrencies } from '../../../shared/currencies';

import { Store } from '@ngrx/store';
import * as SettingsActions from '../../store/settings.actions';
import * as SharedActions from '../../../shared/store/shared.actions';

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

    settingsForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    currencies: object[] = [];

    currencyPositions: object[] =  [
        { key: 'before', value: 'Before' },
        { key: 'after', value: 'After' }
    ];

    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {FormBuilder} _formBuilder
     * @param {Title} _titleService
     * @param {SharedService} _sharedService
     * @param {Store} store
     */
    constructor(
        private httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _titleService: Title,
        private _sharedService: SharedService,
        private store: Store<any>
    )
    {
        this._titleService.setTitle( 'Settings' );
        this._unsubscribeAll = new Subject();
    }

    /**
    * On init
    */
    ngOnInit() {
        this.currencies = availableCurrencies;

        this.settingsForm = this._formBuilder.group({
            site_title : ['', [ Validators.required] ],
            currency : [''],
            currency_position : [''],
        });   
        
        this.store.select(state => state)
            .subscribe(
                (data) => {
                    console.log(data['settings']['data']);
                    let settingsData = data['settings']['data'];
                    this.settingsForm.patchValue({
                        site_title: settingsData['site_title'],
                        currency: settingsData['currency'],
                        currency_position: settingsData['currency_position']
                    });
                }
            );
    }

    /**
    * Submit settings data to API
    */
    onSubmit(){
        if(this.settingsForm.valid){
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            let data = this.settingsForm.value;

           // Send request to update settings
            this.httpClient.post(environment.apiURL+'/settings/update', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            if(response['success']){
                                this._sharedService.openSnackBar('Settings updated successfully.', 'X', 'success');
                                this.store.dispatch(new SettingsActions.SetSettingsData(this.settingsForm.value));
                            }else{
                                this._sharedService.openSnackBar('Settings not updated.', 'X', 'error', 10000);
                            }
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('Settings not updated.', 'X', 'error', 15000);
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }
    }

}
