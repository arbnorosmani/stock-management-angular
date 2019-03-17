import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryListComponent } from './components/list/category-list.component';
import { CategoryCreateComponent } from './components/create/category-create.component';
import { CategoryEditComponent } from './components/edit/category-edit.component';

/**
 * @type {Routes}
 */
const routes: Routes = [
    { path: '', component: CategoryListComponent },
    { path: 'create', component: CategoryCreateComponent },
    { path: 'edit/:id', component: CategoryEditComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
  	exports: [RouterModule]
})
export class CategoryRoutingModule {}
