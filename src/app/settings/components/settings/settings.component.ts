import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { SharedService } from '../../../shared/services/shared.service';
import { environment } from '../../../../environments/environment';
import { currencies as availableCurrencies } from '../../../shared/currencies';

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
     */
    constructor(
        private httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _titleService: Title,
        private _sharedService: SharedService
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
            siteTitle : ['', [ Validators.required] ],
            currency : [''],
            currencyPosition : [''],
        });   
        
        // Send request to get settings
        this.httpClient.get(environment.apiURL+'/settings')
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(
                    (response) => {
                        let data = response['settings'];

                        this.settingsForm.patchValue({
                            siteTitle: data['site_title'],
                            currency: data['currency'],
                            currencyPosition: data['currency_position']
                        });
                    }
                ),
                catchError((error) => {
                    this._sharedService.openSnackBar('There was a problem loading settings data', 'X', 'error', 15000);

                    return Observable.throw(error);
                })
            )
            .subscribe();
    }

    /**
    * Submit settings data to API
    */
    onSubmit(){
        if(this.settingsForm.valid){
            let data = this.settingsForm.value;

           // Send request to update settings
           this.httpClient.post(environment.apiURL+'/settings/update', data)
           .pipe(
               takeUntil(this._unsubscribeAll),
               map (
                   (response) =>{
                        if(response['success']){
                            this._sharedService.openSnackBar('Settings updated successfully.', 'X', 'success');
                        }else{
                            this._sharedService.openSnackBar('Settings not updated.', 'X', 'error', 10000);
                        }
                   }
               ),
               catchError(
                   (error) => {
                       this._sharedService.openSnackBar('Settings not updated.', 'X', 'error', 15000);
                       return Observable.throw(error);
                   }
               )
           )
           .subscribe();
        }
    }

}
