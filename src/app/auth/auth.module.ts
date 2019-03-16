import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module'

import { AuthRoutingModule } from './auth-routing.module';

import { StoreModule } from "@ngrx/store";
import { authReducer } from './store/auth.reducers';

@NgModule({
    declarations: [
        
    ],
    imports: [
        SharedModule,
        AuthRoutingModule,

        StoreModule.forFeature('auth', authReducer), 
    ]
})
export class ProfileModule {}
