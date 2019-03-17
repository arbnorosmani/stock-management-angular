import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";
import {Component, Inject} from "@angular/core";

@Component({
    selector: 'default-dialog',
    template: `
        <h1 mat-dialog-title>{{ data.title }}</h1>
        <div mat-dialog-content>
            <p [innerHTML]="data.text"></p>
        </div>
        <div mat-dialog-actions style="float:right">
            <button mat-button [mat-dialog-close]="'cancel'">No</button>
            <button mat-button color="accent" [mat-dialog-close]="'confirm'" cdkFocusInitial>Confirm</button>
        </div>
    `
})
export class DialogComponent {

    /**
     * @constructor
     *
     * @param {MatDialogRef<AccioDialogComponent>} dialogRef
     * @param {object} data
     */
    constructor(
        public dialogRef: MatDialogRef<DialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { title: '', text: ''}
    )
    {}
}
