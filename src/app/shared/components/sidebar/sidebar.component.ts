import { Component, OnInit } from '@angular/core';

import { appRoutes } from '../../navigation/sidebar';

declare const $: any;

import {Store} from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
      menuItems: any[];
      title: string = 'Stock';

    /**
     * @constructor
     *
     * @param {Store} store
     */  
  	constructor(
        private store: Store<any>
    ) { }

  	ngOnInit() {
        this.menuItems = appRoutes.filter(menuItem => menuItem);
            
        this.store.select(state => state)
            .subscribe(
                (data) => {
                    this.title = data['settings']['data']['site_title'];
                }
            );
	}
	  
  	isMobileMenu() {
  	    if ($(window).width() > 991) {
  	        return false;
  	    }
  	    return true;
  	};
}
