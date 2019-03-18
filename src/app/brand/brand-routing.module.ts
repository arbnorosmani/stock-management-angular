import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrandListComponent } from './components/list/brand-list.component';
import { BrandCreateComponent } from './components/create/brand-create.component';
import { BrandEditComponent } from './components/edit/brand-edit.component';

/**
 * @type {Routes}
 */
const routes: Routes = [
  { path: '', component: BrandListComponent },
  { path: 'create', component: BrandCreateComponent },
  { path: 'edit/:id', component: BrandEditComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class BrandRoutingModule {}
