import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './components/list/product-list.component';

@NgModule({
    declarations: [
        ProductListComponent
    ],
    imports: [
        SharedModule,
        ProductRoutingModule,
    ]
})
export class ProductModule {}
