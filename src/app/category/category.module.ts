import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './components/list/category-list.component';

@NgModule({
    declarations: [
        CategoryListComponent
    ],
    imports: [
        SharedModule,
        CategoryRoutingModule,
    ]
})
export class CategoryModule {}
