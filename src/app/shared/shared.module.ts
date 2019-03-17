import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DialogComponent } from './components/dialog/dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import {
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatMenuModule,
    MatIconModule
} from '@angular/material';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,

        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatProgressBarModule,

        FormsModule,   
        ReactiveFormsModule 
    ],
    exports: [
        CommonModule,
        
        //Components
        FooterComponent,
        NavbarComponent,
        SidebarComponent,

        //Modules
        MatButtonModule,
        MatRippleModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        MatMenuModule,
        MatIconModule,
        MatDialogModule,
        MatProgressBarModule,

        FormsModule,   
        ReactiveFormsModule 
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        DialogComponent
    ],
    entryComponents: [
        DialogComponent
    ]
})

export class SharedModule {}
