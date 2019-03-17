import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteParamsService {

    /**
     * @constructor
     *
     * @param {Router} router
     * @param {ActivatedRoute} route
     */
    constructor(
        private router: Router,
        private route: ActivatedRoute
    ){}

    /**
     * Get parameters needed for API and route navigate
     *
     * @param {number} defaultPageSize
     *
     * @returns {string}
     */
    public getParamsString(defaultPageSize): string {

        let params = '?';
        if (this.route.snapshot.queryParams['size']){
            params += 'size='+this.route.snapshot.queryParams['size'];
        }else{
            params += 'size='+defaultPageSize;
        }

        if (this.route.snapshot.queryParams['page']){
            params += '&page='+this.route.snapshot.queryParams['page'];
        }
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            params += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];
        }

        return params;
    }

    /**
     * Get parameters needed for API and route navigate in sorting
     *
     * @param event
     * @param {number} defaultPageSize
     *
     * @returns {array}
     */
    public customSortParams(event, pageSize){
        let data = [];

        data['stringParams'] = '?size='+pageSize+'&order='+event['active']+'&type='+event['direction'];
        data['queryParams'] = {
            size: this.route.snapshot.queryParams['size'],
            order: event['active'],
            type: event['direction']
        };
        return data;
    }

    /**
     * Get parameters needed for API and route navigate in pagination
     *
     * @param event
     * @param {number} defaultPageSize
     *
     * @returns {array}
     */
    public paginationParams(event, pageSize){
        let data = [];

        data['stringParams'] = '?size='+pageSize+'&page='+(event.pageIndex + 1);
        if (this.route.snapshot.queryParams['order'] && this.route.snapshot.queryParams['type']) {
            data['stringParams'] += '&order='+this.route.snapshot.queryParams['order']+'&type='+this.route.snapshot.queryParams['type'];

            data['queryParams'] = {
                page: (event.pageIndex + 1),
                size: pageSize,
                order: this.route.snapshot.queryParams['order'],
                type: this.route.snapshot.queryParams['type']
            };
        }else{
            data['queryParams'] = {
                page: (event.pageIndex + 1),
                size: pageSize
            };
        }

        return data;
    }
}
