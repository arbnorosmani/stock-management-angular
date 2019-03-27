import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { GoogleChartsModule } from 'angular-google-charts';

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
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

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
        MatChipsModule,
        MatAutocompleteModule,

        FormsModule,
        ReactiveFormsModule,
        GoogleChartsModule.forRoot()
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
        MatChipsModule,
        MatAutocompleteModule,

        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        DialogComponent,
        DashboardComponent
    ],
    entryComponents: [
        DialogComponent
    ]
})

export class SharedModule {}
