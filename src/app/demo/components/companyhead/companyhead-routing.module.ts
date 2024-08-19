import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyheadComponent } from './companyhead.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: CompanyheadComponent }]),
    ],
    exports: [RouterModule],
})
export class CompanyheadRoutingModule {}
