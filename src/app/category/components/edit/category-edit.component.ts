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
  selector: 'category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit, OnDestroy {

    categoryForm: FormGroup;
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
        this._titleService.setTitle( 'Categories - Edit' );
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.categoryForm = this._formBuilder.group({
            name : ['', Validators.required],
            slug : [{ value: '', disabled: true }, [ Validators.required ] ],
            code : ['', Validators.required]
        }); 

        
        // Send request to get category by id
        this.httpClient.get(environment.apiURL+'/categories/'+this.id)
        .pipe(
            takeUntil(this._unsubscribeAll),
            map (
                (response) =>{
                    if(response['success']){
                        let category = response['category'];

                        this.categoryForm.patchValue({
                            name : category['name'],
                            slug : category['slug'],
                            code : category['code']
                        });
                        this.slug = category['slug'];
                    }else{
                        this._sharedService.openSnackBar('There was a problem loading category data.', 'X', 'error', 15000);
                    }
                }
            ),
            catchError(
                (error) => {
                    this._sharedService.openSnackBar('There was a problem while loading category data.', 'X', 'error', 15000);
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
        if(this.categoryForm.valid){
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            let data = this.categoryForm.value;
            data.id = this.id;
            data.slug = this.slug;

            // Send request to update category
            this.httpClient.post(environment.apiURL+'/categories/update', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            if(response['success']){
                                this._sharedService.openSnackBar('Category updated successfully.', 'X', 'success');
                            }else{
                                let errors = response['errors'];
                                this._sharedService.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 15000);
                            }
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while updating this category.', 'X', 'error', 15000);
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
        let name = this.categoryForm.value.name;
        if(name != '' && name != null){
            let data = { name: name, id: this.id };

            // Send request to generate slug
            this.httpClient.post(environment.apiURL+'/categories/generate/slug', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) => {
                            if(response['success']){
                                this.categoryForm.patchValue({
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