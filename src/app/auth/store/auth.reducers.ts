import * as AuthActions from './auth.actions';

export interface State {
    token: string;
    authenticated: boolean;
    authUser: object;
}

/**
 * @type {State}
 */
const initialState: State = {
    token: null,
    authenticated: false,
    authUser: {},
}

/**
 *
 * Check action type and execute action based on it
 *
 * @param {initialState} state
 * @param {AuthActions.AuthActions} action
 */
export function authReducer(state = initialState, action: AuthActions.AuthActions){
    switch (action.type) {

        case (AuthActions.SIGNIN):
            return {
                ...state,
                authenticated: true,
                token: action.payload
            };

        case (AuthActions.SET_AUTH_USER):
          return {
            ...state,
            authUser: action.payload
          };

        case (AuthActions.UPDATE_AUTH_USER):
          let oldUser = {...state.authUser};
          let merged = {...oldUser, ...action.payload};
          return {
              ...state,
              authUser: merged
          };

        case (AuthActions.LOGOUT):
          return {
            ...state,
            token: null,
            authUser: {},
            authenticated: false
          };

        default:
          return state;
    }
}
