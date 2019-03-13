import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';

import {
  AgmCoreModule
} from '@agm/core';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { SharedModule } from "./shared/shared.module";
 
@NgModule({
  	imports: [
      	SharedModule,
      	BrowserAnimationsModule,
      	FormsModule,
      	HttpModule,
      	RouterModule,
      	AppRoutingModule,
      	AgmCoreModule.forRoot({
      	  apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
      	})
  	],
  	declarations: [
    	AppComponent,
    	AdminLayoutComponent,

  	],
  	providers: [],
  	bootstrap: [AppComponent]
})
export class AppModule { }
