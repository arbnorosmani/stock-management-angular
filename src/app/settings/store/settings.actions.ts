import { Action } from '@ngrx/store';

export const SET_SETTINGS_DATA = 'SET_SETTINGS_DATA';

export class SetSettingsData implements Action {
    readonly type = SET_SETTINGS_DATA;

  /**
   * @constructor
   *
   * @param {string} payload
   */
    constructor(public payload: object){}
}

/**
 * Export types
 *
 * @type {SettingsActions}
 */
export type SettingsActions =  SetSettingsData;
