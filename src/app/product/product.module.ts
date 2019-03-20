import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './components/list/product-list.component';
import { ProductCreateComponent } from './components/create/product-create.component';
import { ProductEditComponent } from './components/edit/product-edit.component';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
    declarations: [
        ProductListComponent,
        ProductCreateComponent,
        ProductEditComponent
    ],
    imports: [
        SharedModule,
        ProductRoutingModule,

        NgxMatSelectSearchModule
    ]
})
export class ProductModule {}
