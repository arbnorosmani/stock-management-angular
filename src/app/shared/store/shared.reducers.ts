import * as SharedActions from './shared.actions';

export interface State {
    isLoading: boolean;
}

/**
 * @type {State}
 */
const initialState: State = {
    isLoading: false,
}

/**
 * Check action type and execute action based on it
 *
 * @param {initialState} state
 * @param {SharedActions.SharedActions} action
 */
export function sharedReducer(state = initialState, action: SharedActions.SharedActions){
    switch (action.type) {

        case (SharedActions.SET_IS_LOADING):
            return {
                ...state,
                isLoading: action.payload
            };

        default:
          return state;
    }
}
