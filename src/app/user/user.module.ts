import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './components/list/user-list.component';
import { UserCreateComponent } from './components/create/user-create.component';

@NgModule({
    declarations: [
        UserListComponent,
        UserCreateComponent
    ],
    imports: [
        SharedModule,
        UserRoutingModule,
    ]
})
export class UserModule {}
