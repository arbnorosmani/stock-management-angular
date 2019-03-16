import { Injectable, isDevMode } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

    /**
     * @constructor
     *
     * @param {MatSnackBar} snackBar
     */
    constructor(
        public snackBar: MatSnackBar
    ){}

    /**
     * Open SnackBar
     * @param {string} message
     * @param {string} action
     * @param {string} type
     * @param {number} duration
     */
    openSnackBar(message: string, action: string, type: string, duration: number = 3000) {
        let bgClass = [''];
        if(type == 'success'){
            bgClass = ['success-snackbar'];
        }else if(type == 'error'){
            bgClass = ['danger-snackbar'];
        }

        this.snackBar.open(message, action, {
            duration: duration,
            panelClass: bgClass,
        });
    }
}
