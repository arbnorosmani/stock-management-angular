import { Component, OnInit } from '@angular/core';

import { appRoutes } from '../../navigation/sidebar';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  	menuItems: any[];

  	constructor() { }

  	ngOnInit() {
  	  	this.menuItems = appRoutes.filter(menuItem => menuItem);
	}
	  
  	isMobileMenu() {
  	    if ($(window).width() > 991) {
  	        return false;
  	    }
  	    return true;
  	};
}
