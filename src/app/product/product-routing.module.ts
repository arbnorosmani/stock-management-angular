import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './components/list/product-list.component';
import { ProductCreateComponent } from './components/create/product-create.component';
import { ProductEditComponent } from './components/edit/product-edit.component';

/**
 * @type {Routes}
 */
const routes: Routes = [
  	{ path: '', component: ProductListComponent },
  	{ path: 'create', component: ProductCreateComponent },
  	{ path: 'edit/:id', component: ProductEditComponent }
];

@NgModule({
  	imports: [
    	RouterModule.forChild(routes)
  	],
  	exports: [RouterModule]
})
export class ProductRoutingModule {}
