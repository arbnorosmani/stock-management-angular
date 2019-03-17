import { Component, OnInit, ViewChild } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { SharedService } from '../../../shared/services/shared.service';
import { RouteParamsService } from '../../../shared/services/route-params.service';

import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

import { Store } from '@ngrx/store';
import * as SharedActions from '../../../shared/store/shared.actions';

@Component({
  selector: 'category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

    private _unsubscribeAll: Subject<any>;
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['checkbox', 'id', 'code', 'name', 'slug', 'buttons'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    totalSize: number = 10;
    pageSize: number = 10;

    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {Title} _titleService
     * @param {SharedService} _sharedService
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {RouteParamsService} _routeParamsService
     * @param {MatDialog} dialog
     * @param {Store} store
     */
    constructor(
        private httpClient: HttpClient,
        private _titleService: Title,
        private _sharedService: SharedService,
        private router: Router,
        private route: ActivatedRoute,
        private _routeParamsService: RouteParamsService,
        private dialog: MatDialog,
        private store: Store<any>
    ){}

    /**
     * On init
     */
    ngOnInit() {
        this._titleService.setTitle( 'Categories' );
        this._unsubscribeAll = new Subject();

        if (this.route.snapshot.queryParams['page']){
            this.paginator.pageIndex = this.route.snapshot.queryParams['page'] - 1;
        }

        if (this.route.snapshot.queryParams['size']){
            this.pageSize = this.route.snapshot.queryParams['size'];
        }
       
        let params = this._routeParamsService.getParamsString(this.pageSize);
        
        // Send request to get categories
        this.httpClient.get(environment.apiURL+'/categories'+params)
            .pipe(
                takeUntil(this._unsubscribeAll),
                map (
                    (response) =>{
                        this.dataSource = new MatTableDataSource<any>(response['categories']['data']);
                        this.totalSize = response['total'];
                    }
                ),
                catchError(
                    (error) => {
                        this._sharedService.openSnackBar('There was a problem loading categories.', 'X', 'error', 15000);
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
     * Whether the number of selected elements matches the total number of rows.
     *
     * @return {boolean}
     * */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }


    /**
     * Selects all rows if they are not all selected; otherwise clear selection.
     *
     * */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    /**
    * Sort table data
    * 
    * @param event
    */
    sortTable(event) {
        let params = this._routeParamsService.customSortParams(event, this.pageSize);
        this.router.navigate(["./"],{ relativeTo: this.route, queryParams: params['queryParams']});
        
        this.httpClient.get(environment.apiURL+'/categories'+params['stringParams'])
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['categories']['data']);
                        this.paginator.pageIndex = 0;
                    }
                ),
                catchError((error) => {
                    this._sharedService.openSnackBar('There was a problem loading data', 'X', 'error', 15000);

                    return Observable.throw(error);
                })
            )
            .subscribe();
    }


    /**
    * If a user clicks on next ,prev or size we send a request to get all categories and redraw the table based on the categories criteria
    *
    * @param event
    * */
    onPageChange(event){
        this.pageSize = event.pageSize;
        let params = this._routeParamsService.paginationParams(event, this.pageSize);
        
        this.router.navigate(['./'], { relativeTo: this.route, queryParams: params['queryParams'] });

        this.httpClient.get(environment.apiURL+'/categories'+params['stringParams'])
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['categories']['data']);
                    }
                ),
                catchError((error) => {
                    this._sharedService.openSnackBar('There was a problem loading data', 'X', 'error', 15000);

                    return Observable.throw(error);
                })
            )
            .subscribe();
    }

    /**
    * Delete the category by id
    *
    * @param {number} id
    * @param {number} index
    */
    delete(id, index){

        const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this Category?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.store.dispatch(new SharedActions.SetIsLoading(true));

                // Send request to delete category
                this.httpClient.delete(environment.apiURL+'/categories/delete/'+id)
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        map(
                            (response) => {
                                if(response['success']){
                                    let newData = this.dataSource.data;
                                    newData.splice(index, 1);
                                    this.dataSource = new MatTableDataSource<any>(newData);
                                    this._sharedService.openSnackBar('Category deleted successfully', 'X', 'success');
                                }
                                this.store.dispatch(new SharedActions.SetIsLoading(false));
                            }
                        ),
                        catchError((error) => {
                            this._sharedService.openSnackBar('Category not deleted', 'X', 'error', 15000);
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
        
                            return Observable.throw(error);
                        })
                    )
                    .subscribe();
            }
        });
    }

    /**
    * Delete the selected categories
    */
    bulkDelete(){

        const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete selected categories?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){
                this.store.dispatch(new SharedActions.SetIsLoading(true));

                let selectedData = this.selection.selected;
                var selectedDataKeys = selectedData.map(function(item) { return item["id"]; });
                let data = { ids: selectedDataKeys };

                // Send request to delete Categories
                this.httpClient.post(environment.apiURL+'/categories/delete/bulk', data)
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        map(
                            (response) => {
                                if(response['success']){
                                    this.selection.clear();
                                    let newData = this.dataSource.data;
                                    newData = newData.filter(item => !selectedDataKeys.includes(item.id));
                                    this.dataSource = new MatTableDataSource<any>(newData);

                                    this._sharedService.openSnackBar('Categories deleted successfully', 'X', 'success');
                                }
                                this.store.dispatch(new SharedActions.SetIsLoading(false));
                            }
                        ),
                        catchError((error) => {
                            this._sharedService.openSnackBar('Categories not deleted', 'X', 'error', 15000);
                            this.store.dispatch(new SharedActions.SetIsLoading(false));
        
                            return Observable.throw(error);
                        })
                    )
                    .subscribe();
            }
        });
    }

    addNew(){
        this.router.navigate(['create'], { relativeTo: this.route });
    }

    edit(id){
        this.router.navigate(['edit/'+id], { relativeTo: this.route });
    }


}
