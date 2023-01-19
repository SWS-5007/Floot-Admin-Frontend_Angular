import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ProductService } from "src/app/services/gp-calculator/gp-calculator.service";
import Product from "../../../../interfaces/product.interface";
import { SelectedProductComponent } from "../selected-product/selected-product.component";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.less"],
})
export class ProductListComponent implements OnInit {
  productId: number;
  testMessage = "hello from test";
  @Input() productList: Product[];
  @Output() selectedProductId = new EventEmitter<any>();

  constructor(
    private dialogModel: MatDialog,
    private ProductService: ProductService
  ) {}

  sendSelectedProductId(product) {
    console.log("peoriidd", product);
    this.selectedProductId.emit(product.id);
  }

  ngOnInit(): void {}

  // onSelect(id) {
  //   console.log("hit id:", id)
  //   console.log(this.selectedProductId)
  //   this.selectedProductId = id

  // }

  // selectedProduct(product: Product) {
  //   console.log("selected product", product)
  //   this.product_id = product.product_id
  //   this.allIngredients = [...product.ingredients];
  //   this.listPrice = product.listPrice;
  //   this.productName = product.productName;
  //   this.garnish = product.garnish;
  //   this.method = product.method;
  //   this.glass = product.glass;
  //   this.garnishDesc = product.garnishDesc;
  //   this.liveOnList = product.liveOnList;

  //   const garnishInput = (document.getElementById("garnish-input") as HTMLInputElement)
  //   if (this.garnish) {
  //     garnishInput.checked = true;
  //   } else {
  //     garnishInput.checked = false;
  //   }
  // }

  editAction(product: any) {
    // console.log("inside onSelect")
    // console.log(this.product.id)
    // console.log(this.product)

    //  this.selectedProduct.emit(this.product.id);
    let dialogRef = this.dialogModel.open(SelectedProductComponent, {
      width: "100%",
      height: "550px",
    });
    dialogRef.componentInstance.selectedProduct = product;
    dialogRef.componentInstance.selectedProductId = product.id;
  }

  public async deleteAction(product: any) {
    if (confirm("Are you sure want to delete this product"))
      await this.ProductService.deleteProduct(product.id, product.ingredients);
  }
}
