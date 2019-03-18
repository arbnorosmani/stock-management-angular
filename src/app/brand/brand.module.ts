import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { BrandRoutingModule } from './brand-routing.module';
import { BrandListComponent } from './components/list/brand-list.component';
import { BrandCreateComponent } from './components/create/brand-create.component';
import { BrandEditComponent } from './components/edit/brand-edit.component';

@NgModule({
    declarations: [
        BrandListComponent,
        BrandCreateComponent,
        BrandEditComponent
    ],
    imports: [
        SharedModule,
        BrandRoutingModule,
    ]
})
export class BrandModule {}
