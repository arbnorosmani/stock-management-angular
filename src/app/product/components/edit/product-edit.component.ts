import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

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

import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material';

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {

    productForm: FormGroup;
    private _unsubscribeAll: Subject<any>;
    id: number;
    slug: string;
    protected brands: object[] = [];
    protected categories = [];
    protected selectedCategories =  [];
    removable: boolean = true;
    user: object = { id: '', name: '' };

    @ViewChild('catInput') catInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto') matAutocomplete: MatAutocomplete;

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
        this._titleService.setTitle( 'Products - Edit' );
        this._unsubscribeAll = new Subject();
    }

    /**
     * On init
     */
    ngOnInit() {
        this.id = this.route.snapshot.params['id'];

        this.productForm = this._formBuilder.group({
            name : ['', Validators.required],
            slug : [{ value: '', disabled: true }, [ Validators.required ] ],
            code : ['', Validators.required],
            price: ['', [Validators.required]],
            quantity: ['', [Validators.required] ],
            brand: ['', Validators.required],
            categories: [[]]
        });


        // Send request to get category by id
        this.httpClient.get(environment.apiURL+'/products/'+this.id)
        .pipe(
            takeUntil(this._unsubscribeAll),
            map (
                (response) =>{
                    if(response['success']){
                        let product = response['product'];

                        this.productForm.patchValue({
                            name : product['name'],
                            slug : product['slug'],
                            code : product['code'],
                            price : product['price'],
                            quantity : product['quantity'],
                            brand : product['brand_id'],
                        });
                        this.slug = product['slug'];
                        this.selectedCategories = product['categories'];
                        this.brands = [product['brand']];
                        this.user = product['user'];
                    }else{
                        this._sharedService.openSnackBar('There was a problem loading product data.', 'X', 'error', 15000);
                    }
                }
            ),
            catchError(
                (error) => {
                    this._sharedService.openSnackBar('There was a problem while loading product data.', 'X', 'error', 15000);
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
        if(this.productForm.valid){
            this.store.dispatch(new SharedActions.SetIsLoading(true));
            let data = this.productForm.value;
            data.id = this.id;
            data.slug = this.slug;
            data.categories = this.selectedCategories;

            // Send request to update category
            this.httpClient.post(environment.apiURL+'/products/update', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            if(response['success']){
                                this._sharedService.openSnackBar('Product updated successfully.', 'X', 'success');
                            }else{
                                let errors = response['errors'];
                                this._sharedService.openSnackBar(errors[Object.keys(errors)[0]], 'X', 'error', 15000);
                            }
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while updating this product.', 'X', 'error', 15000);
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
        let name = this.productForm.value.name;
        if(name != '' && name != null){
            let data = { name: name, id: this.id };

            // Send request to generate slug
            this.httpClient.post(environment.apiURL+'/products/generate/slug', data)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) => {
                            if(response['success']){
                                this.productForm.patchValue({
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

    /**
     * Search brands based on value param
     *
     * @param event
     */
    searchBrands(event){
        let value = event.target.value;

        if(
            (value != '' && value != null) &&
            event.keyCode !== 13 && //enter
            event.keyCode !== 40 && //down arrow
            event.keyCode !== 38 //up arrow
        ){
            //Send request to search brands
            this.httpClient.get(environment.apiURL+'/brands/search/'+value)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            this.brands = response['brands'];
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while loading brands.', 'X', 'error', 15000);

                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }else{
            this.brands = [];
            this.productForm.patchValue({
                brand: ''
            });
        }

    }

    /**
     * Search categories based on value param
     *
     * @param event
     */
    searchCategories(event){
        let value = event.target.value;

        if(
            (value != '' && value != null) &&
            event.keyCode !== 13 && //enter
            event.keyCode !== 40 && //down arrow
            event.keyCode !== 38 //up arrow
        ){

            //Send request to search categories
            this.httpClient.get(environment.apiURL+'/categories/search/'+value)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    map (
                        (response) =>{
                            this.categories = response['categories'];
                        }
                    ),
                    catchError(
                        (error) => {
                            this._sharedService.openSnackBar('There was a problem while loading categories.', 'X', 'error', 15000);

                            return Observable.throw(error);
                        }
                    )
                )
                .subscribe();
        }
    }

    /**
     * Remove category from selected
     *
     * @param {object} category
     */
    removeCategory(category): void {
        const index = this.selectedCategories.indexOf(category);

        if (index >= 0) {
            this.selectedCategories.splice(index, 1);
        }
    }

    /**
     * Add category to selected
     *
     * @param {MatAutocompleteSelectedEvent} event
     */
    selectedCategory(event: MatAutocompleteSelectedEvent): void {
        let checkIfExists = this.selectedCategories.some(function(obj){return obj["id"] === event.option.value.id;});

        if( !checkIfExists ){
            this.selectedCategories.push(event.option.value);
            this.catInput.nativeElement.value = '';
        }else{
            this._sharedService.openSnackBar('This category has been added already', 'X', 'error');
        }
    }

}
