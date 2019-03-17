import * as SettingsActions from './settings.actions';

export interface State {
    data: object;
}

/**
 * @type {State}
 */
const initialState: State = {
    data: {},
}

/**
 *
 * Check action type and execute action based on it
 *
 * @param {initialState} state
 * @param {SettingsActions.SettingsActions} action
 */
export function settingsReducer(state = initialState, action: SettingsActions.SettingsActions){
    switch (action.type) {

        case (SettingsActions.SET_SETTINGS_DATA):
            let oldSettings = {...state.data};
            let merged = {...oldSettings, ...action.payload};
            return {
                ...state,
                data: merged
            };

        default:
          return state;
    }
}
