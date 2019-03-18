import { Component, OnInit, OnDestroy } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { SharedService } from '../../../shared/services/shared.service';
import { environment } from '../../../../environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

import { Store } from '@ngrx/store';
import * as SharedActions from '../../../shared/store/shared.actions';

@Component({
  selector: 'brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.css']
})
export class BrandEditComponent implements OnInit, OnDestroy {

    brandForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    id: number;
    slug: string;
 
    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {FormBuilder} _formBuilder
     * @param {Title} _titleService
     * @param {SharedService} _sharedService
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {Store} store
     */
    constructor(
        private httpClient: HttpClient,
        private _formBuilder: FormBuilder,
        private _titleService: Title,
        private _sharedService: SharedService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<any>
    )
    {
        this._titleService.setTitle( 'Brands - Edit' );
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.brandForm = this._formBuilder.group({
            name : ['', Validators.required],
            slug : [{ value: '', disabled: true }, [ Validators.required ] ],
            code : ['', Validators.required]
        }); 

        
        // Send request to get brand by id
        this.httpClient.get(environment.apiURL+'/brands/'+this.id)
        .pipe(
            takeUntil(this._unsubscribeAll),
            map (
                (response) =>{
                    if(response['success']){
                        let brand = response['brand'];

                        this.brandForm.patchValue({
                            name : brand['name'],
                            slug : brand['slug'],
                            code : brand['code']
                        });
                        this.slug = brand['slug'];
                    }else{
                        this._sharedService.openSnackBar('There was a problem loading brand data.', 'X', 'error', 15000);
                    }
                }
            ),
            catchError(
                (error) => {
                    this._sharedService.openSnackBar('There was a problem while loading brand data.', 'X', 'error', 15000);
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
        if(this.brandForm.valid){
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            let data = this.brandForm.value;
            data.id = this.id;
            data.slug = this.slug;

            // Send request to update brand
            this.httpClient.post(environment.apiURL+'/brands/update', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            if(response['success']){
                                this._sharedService.openSnackBar('Brand updated successfully.', 'X', 'success');
                            }else{
                                let errors = response['errors'];
                                this._sharedService.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 15000);
                            }
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while updating this brand.', 'X', 'error', 15000);
                            this.store.dispatch(new SharedActions.SetIsLoading(false));

                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }
    }

    /**
     * Generate slug in API and return value
     */
    generateSlug(){
        let name = this.brandForm.value.name;
        if(name != '' && name != null){
            let data = { name: name, id: this.id };

            // Send request to generate slug
            this.httpClient.post(environment.apiURL+'/brands/generate/slug', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) => {
                            if(response['success']){
                                this.brandForm.patchValue({
                                    slug: response['slug']
                                });
                                this.slug = response['slug'];
                            }
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while generating slug.', 'X', 'error', 15000);

                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }
    }

}