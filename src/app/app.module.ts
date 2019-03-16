import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './auth/components/login/login.component';

import { SharedModule } from "./shared/shared.module";

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducer } from './store/app.reducers';
import { environment } from '../environments/environment';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/services/auth.interceptor';
import { AuthGuard } from './auth/services/auth-guard.service';
 
@NgModule({
  	imports: [
      	SharedModule,
      	BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      	HttpModule,
        RouterModule,
        HttpClientModule,
		AppRoutingModule,
				
		StoreModule.forRoot(appReducer),
        !environment.production ? StoreDevtoolsModule.instrument() : []
  	],
  	declarations: [
    	AppComponent,
        AdminLayoutComponent,
        LoginComponent
  	],
  	providers: [
        AuthGuard,
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ], 
  	bootstrap: [AppComponent]
})
export class AppModule { }
