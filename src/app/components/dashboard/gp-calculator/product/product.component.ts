import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";
import Product from "../../../../interfaces/product.interface";
import { SelectedProductComponent } from "../selected-product/selected-product.component";

@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.less"],
})
export class ProductComponent implements OnInit {
  live: boolean;
  ingredients: any;
  @ViewChild(MatSort) sort: MatSort;

  displayColumns: string[] = [
    "name",
    "cost",
    "mls",
    "unit_cost",
    "gross",
    "gp_per_unit",
    "margin",
  ];
  tableData: Element[] = [];

  dataSource = null;
  constructor(private dialogModel: MatDialog) {}
  @Input() product!: Product;
  @Input() productIndex;
  @Output() selectedProduct = new EventEmitter<Product["id"]>();

  // productIngredients = [...this.product.ingredients];

  ngOnInit(): void {
    console.log("inside product");
    console.log(this.product);
  }

  logIngredients() {
    // console.log (this.product.ingredients)
  }

  toggleLiveOnList() {
    this.live = !this.live;
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
    dialogRef.componentInstance.selectedProduct = this.product;
    dialogRef.componentInstance.selectedProductId = this.product.id;
  }
}
