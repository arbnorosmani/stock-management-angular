import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './auth/components/login/login.component';
import { AuthGuard } from './auth/services/auth-guard.service';

const routes: Routes =[
    { path: '', redirectTo: 'dashboard', pathMatch: 'full', }, 
    { path: 'login', component: LoginComponent }, 
    { path: '', component: AdminLayoutComponent, canActivate: [AuthGuard], children: [ 
		{ path: '', loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule' },
		{ path: 'products', loadChildren: './product/product.module#ProductModule' },
		{ path: 'brands', loadChildren: './brand/brand.module#BrandModule' },
		{ path: 'categories', loadChildren: './category/category.module#CategoryModule' },
		{ path: 'users', loadChildren: './user/user.module#UserModule' },
		{ path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
		{ path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
    ]}
];

@NgModule({
  	imports: [
  	  	CommonModule,
  	  	BrowserModule,
  	  	RouterModule.forRoot(routes)
  	],
  	exports: [
  	],
})
export class AppRoutingModule { }
