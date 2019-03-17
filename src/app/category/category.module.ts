import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './components/list/category-list.component';
import { CategoryCreateComponent } from './components/create/category-create.component';
import { CategoryEditComponent } from './components/edit/category-edit.component';

@NgModule({
    declarations: [
        CategoryListComponent,
        CategoryCreateComponent,
        CategoryEditComponent
    ],
    imports: [
        SharedModule,
        CategoryRoutingModule,
    ]
})
export class CategoryModule {}
