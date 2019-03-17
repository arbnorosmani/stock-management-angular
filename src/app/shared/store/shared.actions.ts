import { Action } from '@ngrx/store';

export const SET_IS_LOADING = 'SET_IS_LOADING';

export class SetIsLoading implements Action {
    readonly type = SET_IS_LOADING;

  /**
   * @constructor
   *
   * @param {boolean} payload
   */
    constructor(public payload: boolean){}
}

/**
 * Export types
 *
 * @type {SharedActions}
 */
export type SharedActions =  SetIsLoading;
