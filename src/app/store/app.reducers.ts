import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducers';
import * as fromSettings from '../settings/store/settings.reducers';
import * as fromShared from '../shared/store/shared.reducers';

/**
 * Check action type and execute action based on it
 *
 * @param state
 * @param {Action} action
 */

export interface AppState{
    auth: fromAuth.State,
    settings: fromSettings.State,
    shared: fromShared.State
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    settings: fromSettings.settingsReducer,
    shared: fromShared.sharedReducer
}
