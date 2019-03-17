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

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

    private _unsubscribeAll: Subject<any>;
    dataSource = new MatTableDataSource<any>([]);
    selection = new SelectionModel<any>(true, []);
    displayedColumns: string[] = ['checkbox', 'id', 'name', 'email', 'phone', 'buttons'];
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
     */
    constructor(
        private httpClient: HttpClient,
        private _titleService: Title,
        private _sharedService: SharedService,
        private router: Router,
        private route: ActivatedRoute,
        private _routeParamsService: RouteParamsService,
        private dialog: MatDialog
    ){}

    /**
     * On init
     */
    ngOnInit() {
        this._titleService.setTitle( 'Users' );
        this._unsubscribeAll = new Subject();

        if (this.route.snapshot.queryParams['page']){
            this.paginator.pageIndex = this.route.snapshot.queryParams['page'] - 1;
        }

        if (this.route.snapshot.queryParams['size']){
            this.pageSize = this.route.snapshot.queryParams['size'];
        }
       
        let params = this._routeParamsService.getParamsString(this.pageSize);
        
        // Send request to get users
        this.httpClient.get(environment.apiURL+'/users'+params)
            .pipe(
                takeUntil(this._unsubscribeAll),
                map (
                    (response) =>{
                        this.dataSource = new MatTableDataSource<any>(response['users']['data']);
                        this.totalSize = response['total'];
                    }
                ),
                catchError(
                    (error) => {
                        this._sharedService.openSnackBar('There was a problem loading users.', 'X', 'error', 15000);
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
        
        this.httpClient.get(environment.apiURL+'/users'+params['stringParams'])
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['users']['data']);
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
    * If a user clicks on next ,prev or size we send a request to get all users and redraw the table based on the users criteria
    *
    * @param event
    * */
    onPageChange(event){
        this.pageSize = event.pageSize;
        let params = this._routeParamsService.paginationParams(event, this.pageSize);
        
        this.router.navigate(['./'], { relativeTo: this.route, queryParams: params['queryParams'] });

        this.httpClient.get(environment.apiURL+'/users'+params['stringParams'])
            .pipe(
                takeUntil(this._unsubscribeAll),
                map(
                    (response) => {
                        this.dataSource = new MatTableDataSource<any>(response['users']['data']);
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
    * Delete the user by id
    *
    * @param {number} id
    * @param {number} index
    */
    delete(id, index){

        const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete this User?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){

                // Send request to delet user
                this.httpClient.delete(environment.apiURL+'/users/delete/'+id)
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        map(
                            (response) => {
                                if(response['success']){
                                    let newData = this.dataSource.data;
                                    newData.splice(index, 1);
                                    this.dataSource = new MatTableDataSource<any>(newData);
                                    this._sharedService.openSnackBar('User deleted successfully', 'X', 'success');
                                }
                            }
                        ),
                        catchError((error) => {
                            this._sharedService.openSnackBar('User not deleted', 'X', 'error', 15000);
        
                            return Observable.throw(error);
                        })
                    )
                    .subscribe();
            }
        });
    }

    /**
    * Delete the selected users
    */
    bulkDelete(){

        const dialogRef = this.dialog.open(DialogComponent, {
            width: '400px',
            data: {
                title: 'Delete',
                text: 'Are you sure that you want to delete selected Users?'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result == 'confirm'){

                let selectedData = this.selection.selected;
                var keyArray = selectedData.map(function(item) { return item["id"]; });
                let data = { ids: keyArray };

                // Send request to delete users
                this.httpClient.post(environment.apiURL+'/users/delete/bulk', data)
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        map(
                            (response) => {
                                if(response['success']){
                                    this.selection.clear();
                                    let newData = this.dataSource.data;
                                    newData = newData.filter(item => !keyArray.includes(item.id));
                                    this.dataSource = new MatTableDataSource<any>(newData);

                                    this._sharedService.openSnackBar('Users deleted successfully', 'X', 'success');
                                }
                            }
                        ),
                        catchError((error) => {
                            this._sharedService.openSnackBar('Users not deleted', 'X', 'error', 15000);
        
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
