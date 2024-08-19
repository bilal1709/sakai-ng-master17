import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyheadComponent } from './companyhead.component'; // Adjust path as needed
import { CompanyheadRoutingModule } from './companyhead-routing.module'; // Adjust path as needed
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';


@NgModule({
    imports: [
        CommonModule,
        CompanyheadRoutingModule,
        ButtonModule,
        TableModule,
        InputTextModule,
        DividerModule,
        ImageModule,
        DialogModule,
        RippleModule,
    ],
    declarations: [CompanyheadComponent]
})
export class CompanyheadModule { }
