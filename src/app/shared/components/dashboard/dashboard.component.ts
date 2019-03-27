import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

import { Subject, Observable } from 'rxjs/index';
import { takeUntil, map, catchError } from "rxjs/operators";
import { environment } from '../../../../environments/environment';

import { SharedService } from '../../../shared/services/shared.service';
import { Store } from '@ngrx/store';
import * as SharedActions from '../../../shared/store/shared.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    private _unsubscribeAll: Subject<any>;
    countProducts: number;
    countBrands: number;
    countCategories: number;
    countUsers: number;

    datesChart: object = {
        title: 'Last 30 days',
        type: 'LineChart',
        data: [
            ['2004',  1000,      400],
            ['2005',  1170,      460],
            ['2006',  660,       1120],
            ['2007',  1030,      540]
        ],
        columnNames: ['Year', 'Sales', 'Expenses'],,
        options: {
            curveType: 'function',
            legend: { position: 'bottom' }
        }
    };

    productChart: object = {
        title: 'Products',
        type: 'PieChart',
        data: [
            ['Glasses', 45.0],
            ['Shirt', 26.8],
        ],
        columnNames: ['Browser', 'Percentage'],
        options: {}
    };



    /**
     * @constructor
     *
     * @param {HttpClient} httpClient
     * @param {Title} _titleService
     * @param {SharedService} _sharedService
     * @param {Store} store
     */
    constructor(
        private httpClient: HttpClient,
        private _titleService: Title,
        private _sharedService: SharedService,
        private store: Store<any>
    ) {
        this._titleService.setTitle( 'Settings' );
        this._unsubscribeAll = new Subject();
    }

    /**
     * On Init
     */
    ngOnInit() {
        this.store.dispatch(new SharedActions.SetIsLoading(true));

        // Send request to get data
        this.httpClient.get(environment.apiURL+'/dashboard-data')
            .pipe(
                takeUntil(this._unsubscribeAll),
                map (
                    (response) =>{
                        this.countProducts = response['countProducts'];
                        this.countBrands = response['countBrands'];
                        this.countCategories = response['countCategories'];
                        this.countUsers = response['countUsers'];

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
