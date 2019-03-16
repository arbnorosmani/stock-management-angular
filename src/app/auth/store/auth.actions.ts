import { Action } from '@ngrx/store';

export const SIGNIN = 'SIGNIN';
export const LOGOUT = 'LOGOUT';
export const LOGOUT_TIMEOUT = 'LOGOUT_TIMEOUT';
export const SET_AUTH_USER = 'SET_AUTH_USER';
export const UPDATE_AUTH_USER = 'UPDATE_AUTH_USER';

export class Signin implements Action {
    readonly type = SIGNIN;

  /**
   * @constructor
   *
   * @param {string} payload
   */
    constructor(public payload: string){}
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export class SetAuthUser implements Action {
    readonly type = SET_AUTH_USER;

  /**
   * @constructor
   *
   * @param {object} payload
   */
    constructor(public payload: object){}
}

export class UpdateAuthUser implements Action {
  readonly type = UPDATE_AUTH_USER;

  /**
   * @constructor
   *
   * @param {object} payload
   */
  constructor(public payload: object){}
}

/**
 * Export types
 *
 * @type {AuthActions}
 */
export type AuthActions =  Signin |
                            Logout |
                            SetAuthUser |
                            UpdateAuthUser;
