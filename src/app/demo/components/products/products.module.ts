import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { productsModule } from "./products-routing.module";
import { ProductsComponent } from "./products.component";

@NgModule({
    imports: [CommonModule, productsModule],
    declarations: [ProductsComponent],
})
export class ProductsModule {}
