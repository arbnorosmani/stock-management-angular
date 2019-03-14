import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { BrandRoutingModule } from './brand-routing.module';
import { BrandListComponent } from './components/list/brand-list.component';

@NgModule({
    declarations: [
        BrandListComponent
    ],
    imports: [
        SharedModule,
        BrandRoutingModule,
    ]
})
export class BrandModule {}
