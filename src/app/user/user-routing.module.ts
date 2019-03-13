import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './components/list/user-list.component';
import { UserCreateComponent } from './components/create/user-create.component';

/**
 * @type {Routes}
 */
const routes: Routes = [
    { path: '', component: UserListComponent },
    { path: 'create', component: UserCreateComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UserRoutingModule {}
