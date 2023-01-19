import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  Input,
} from "@angular/core";
import { ProductService } from "../../../../services/gp-calculator/gp-calculator.service";
import Product from "../../../../interfaces/ingredient.interface";
import { MatDialog } from "@angular/material/dialog";
import { SelectedProductComponent } from "../selected-product/selected-product.component";

@Component({
  selector: "app-gp-calculator",
  templateUrl: "./gp-calculator-container.component.html",
  styleUrls: ["./gp-calculator-container.component.less"],
})
export class GpCalculatorContainerComponent implements OnInit {
  selectedProduct: Product;
  selectedProductId: number;
  venue_id: number;
  @Input() product!: Product;
  public productList: Product[];
  public productListCopy: Product[];
  public ingredientsList = [];

  constructor(
    private ProductService: ProductService,
    private dialogModel: MatDialog
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    //this.loadProducts(this.venue_id)
  }

  ngOnInit(): void {
    this.venue_id = 1;
    this.loadProducts(this.venue_id);
  }

  refreshProductList(): void {
    this.loadProducts(this.venue_id);
  }

  // get products() {
  //   console.log("hitting get products")
  //   return this.productList
  // }

  recieveSelectedProductId(id: number) {
    // console.log("inside recieveSelectedProductId")
    // console.log("arg 1 is:", id)
    const selectedProductIndex = this.productList.findIndex((product) => {
      return product.id === id;
    });
    let productListCopy = [...this.productList];
    this.selectedProductId = id;
    this.selectedProduct = this.productList[selectedProductIndex];
  }

  searchProductList(event: any) {
    this.productList = this.productListCopy;
    console.log("inside search input");
    const result = this.productList.filter((product) => {
      return product.name
        .toUpperCase()
        .includes(`${event.target.value.toUpperCase()}`);
    });
    this.productList = result;
  }

  public async loadProducts(venue_id: number) {
    const res = await this.ProductService.getProducts(venue_id);
    console.log("loadProducts");
    this.productList = res;
    this.productListCopy = [...res];
    console.log("productList is:", this.productList);
  }

  onSelect() {
    // console.log("inside onSelect")
    // console.log(this.product.id)
    // console.log(this.product)

    //  this.selectedProduct.emit(this.product.id);
    let dialogRef = this.dialogModel.open(SelectedProductComponent, {
      width: "100%",
      height: "550px",
    });
    dialogRef.componentInstance.addProduct = true;
  }
}
