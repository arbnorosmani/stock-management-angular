import { ActionReducerMap, Action } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducers';

/**
 * Check action type and execute action based on it
 *
 * @param state
 * @param {Action} action
 */

export interface AppState{
    auth: fromAuth.State
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer
}
