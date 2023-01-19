import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  AfterContentChecked,
} from "@angular/core";
import { ProductService } from "../../../../services/gp-calculator/gp-calculator.service";
import Ingredient from "../../../../interfaces/ingredient.interface";
import Product from "../../../../interfaces/product.interface";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from "@angular/forms";
import { elementAt } from "rxjs";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-selected-product",
  templateUrl: "./selected-product.component.html",
  styleUrls: ["./selected-product.component.less"],
})
export class SelectedProductComponent implements OnInit {
  //export class SelectedProductComponent implements OnInit, AfterContentChecked {
  @Input() addProduct;
  @Input() selectedProduct: Product;
  @Input() selectedProductId!: number;
  @Output() loadProducts = new EventEmitter<any>();

  //selectedProductForm: any;
  lineValueTotal: number;
  gross: number;
  gross_profit: number;
  margin: number;
  name: string;
  add_pct: boolean;
  id: number;
  venue_id: number;
  garnishInput: HTMLInputElement;
  liveInput: HTMLInputElement;
  showSelectedProductComponent: boolean;

  live: boolean;
  cost: number;
  garnish_description: string;
  preparation_method: string;
  glass_to_use: string;

  // name:string = new FormControl('');

  //public productIngredients = [];
  ingredients = [];
  ingredientsList = [];
  ingredientsToDelete = [];
  ingredientsToUpdate = [];
  ingredientsToCreate = [];

  constructor(
    private ProductService: ProductService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) {}

  selectedProductForm = this.fb.group({
    nameControl: [null],
    listPriceControl: [null],
    garnishControl: [null],
    preparationControl: [null],
    glassControl: [null],
    ingredients: this.fb.array([]),
    // liveControl: [false],
    // addPctControl: [false]
  });

  // this.live = this.selectedProduct.live;
  // this.cost = this.selectedProduct.cost;
  // this.garnish_description = this.selectedProduct.garnish_description;
  // this.preparation_method = this.selectedProduct.preparation_method;
  // this.glass_to_use = this.selectedProduct.glass_to_use;
  // this.id = this.selectedProduct.id;
  // this.venue_id = this.selectedProduct.venue_id;

  // this.garnishInput = (document.getElementById("garnish-input") as HTMLInputElement)
  // this.liveInput = (document.getElementById("live-input") as HTMLInputElement)

  ngOnInit(): void {
    this.venue_id = 1;
    this.loadIngredients();
    // }

    // ngOnChanges(changes: SimpleChanges): void {
    // console.log("ingredients:")
    // console.dir(this.ingredients)
    if (this.addProduct) {
      this.showSelectedProductComponent = true;
    }
    if (this.selectedProduct) {
      this.name = this.selectedProduct.name;
      this.margin = this.selectedProduct.margin;
      this.gross = this.selectedProduct.gross;
      this.add_pct = this.selectedProduct.add_pct;
      this.showSelectedProductComponent = true;

      if (this.selectedProduct.ingredients !== null) {
        this.ingredients = [...this.selectedProduct.ingredients];
        this.ingredients.forEach((ingredient) => {
          ingredient.product_id = this.id;
        });
      } else {
        this.ingredients = [];
      }

      //DUMMY INGREDIENTS DELETE WHEN NOT NEEDED
      // this.ingredients.push({
      //   id: 123,
      //   name: "VODKA",
      //   brand: "filler Brand",
      //   product_id: 2,
      //   venue_id: 1,
      //   ml: 200,
      //   cost: 2.0,
      //   rate: 0.0023,
      //   inv_updated: null,
      //   inv_cost: null,
      //   inv_rate: null,
      //   supplier_id: null,
      //   gross: 12
      // })

      this.selectedProductForm = this.fb.group({
        nameControl: [this.selectedProduct.name],
        listPriceControl: [this.selectedProduct.gross],
        garnishControl: [this.selectedProduct.garnish_description],
        preparationControl: [this.selectedProduct.preparation_method],
        glassControl: [this.selectedProduct.glass_to_use],
        ingredients: this.fb.array([this.ingredients]),
      });
      this.selectedProductForm.controls["ingredients"] as FormArray;

      this.live = this.selectedProduct.live;
      this.cost = this.selectedProduct.cost;
      this.garnish_description = this.selectedProduct.garnish_description;
      this.preparation_method = this.selectedProduct.preparation_method;
      this.glass_to_use = this.selectedProduct.glass_to_use;
      this.id = this.selectedProduct.id;
      this.venue_id = this.selectedProduct.venue_id;

      this.garnishInput = document.getElementById(
        "garnish-input"
      ) as HTMLInputElement;
      this.liveInput = document.getElementById(
        "live-input"
      ) as HTMLInputElement;
      if (this.garnishInput) {
        this.checkGarnishInput();
      }
      if (this.liveInput) {
        this.checkLiveInput();
      }
    }
    // this.name = this.selectedProduct.name;
    // this.margin = this.selectedProduct.margin;
    // this.gross = this.selectedProduct.gross;
    // this.add_pct = this.selectedProduct.add_pct;
    // if (this.selectedProduct.ingredients !== null) {
    //   this.ingredients = [...this.selectedProduct.ingredients]
    // }
    // this.live = this.selectedProduct.live;
    // this.cost = this.selectedProduct.cost;
    // this.garnish_description = this.selectedProduct.garnish_description;
    // this.preparation_method = this.selectedProduct.preparation_method;
    // this.glass_to_use = this.selectedProduct.glass_to_use;
    // this.id = this.selectedProduct.id;
    // this.venue_id = this.selectedProduct.venue_id;

    // this.garnishInput = (document.getElementById("garnish-input") as HTMLInputElement)
    // this.liveInput = (document.getElementById("live-input") as HTMLInputElement)
    // if (this.garnishInput) {
    //   this.checkGarnishInput()
    // }
    // if (this.liveInput) {
    //   this.checkLiveInput()
    // }

    // ngAfterContentChecked() {
  }

  checkGarnishInput() {
    this.garnishInput = document.getElementById(
      "garnish-input"
    ) as HTMLInputElement;

    //console.log("inside garnishInput")
    if (this.add_pct) {
      this.garnishInput.checked = true;
      // console.log("hit true route", this.garnishInput.checked)
    } else {
      this.garnishInput.checked = false;
      //console.log("hit false route", this.garnishInput.checked)
    }
  }

  checkLiveInput() {
    this.liveInput = document.getElementById("live-input") as HTMLInputElement;

    //console.log("inside garnishInput")
    if (this.live) {
      this.liveInput.checked = true;
      // console.log("hit true route", this.garnishInput.checked)
    } else {
      this.liveInput.checked = false;
      //console.log("hit false route", this.garnishInput.checked)
    }
  }
  // get productIngredients() {
  //   return this.selectedProduct.ingredients;
  // }

  async loadIngredients() {
    this.ingredientsList = await this.ProductService.getingredients(
      this.venue_id
    );
  }
  closeDialog(): void {
    this.dialog.closeAll();
  }

  logData() {
    //console.log("allIngredients", this.ingredients)
    // console.log(`
    // lineValueTotal: ${this.lineValueTotal}
    // listPrice: ${this.selectedProduct.gross}
    // GPP: ${this.margin}
    // productName: ${this.selectedProduct.name}
    // product_id: ${this.selectedProduct.id}
    // garnish: ${this.selectedProduct.add_pct}
    // `)
    console.log("selectedProductForm");
    console.dir(this.selectedProductForm);

    console.log("ingredients");
    console.dir(this.ingredients);

    // console.log("ingredients:")
    // console.dir(this.ingredients)

    console.log(`
      this.name: ${this.name}
      this.ingredients: ${this.ingredients}
      this.margin: ${this.margin}
      this.id: ${this.id}
      this.add_pct: ${this.add_pct}
    `);
    //this.loadProducts.emit(this.venue_id)
    // console.dir(this.selectedProduct)this.
  }
  calculateLineValueTotal() {
    const total = this.ingredients.reduce((total, currVal) => {
      return total + currVal.cost;
    }, 0);
    // console.log("triggered calculateLineValueTotal")
    this.lineValueTotal = total;
    // return this.lineValueTotal;
  }

  calculateGPPTotal() {
    // console.log("triggered calculateGPPTotal")
    this.calculateLineValueTotal();
    if (this.add_pct) {
      let garnishCost = (this.lineValueTotal / 100) * 5;
      this.gross_profit = this.gross - (this.lineValueTotal + garnishCost);
      this.margin = (this.gross_profit / this.gross) * 100;
    } else {
      this.gross_profit = this.gross - this.lineValueTotal;
      this.margin = (this.gross_profit / this.gross) * 100;
    }
    return this.margin.toFixed(2);
  }

  calculateTotalProductVolume() {
    const totalVolume = this.ingredients.reduce((total, currVal) => {
      return total + currVal.ml;
    }, 0);
    return totalVolume;
  }

  addIngredient() {
    // this.ingredients.push({
    //   name: "",
    //   brand: "",
    //   ml: 0,
    //   rate: 0,
    //   cost: 0,
    //   product_id: this.id,
    //   venue_id: this.venue_id
    // });
    const newIngredientForm = this.fb.group({
      name: [""],
      brand: [null],
      ml: [0],
      rate: [0],
      cost: [0],
      product_id: [this.id],
      venue_id: [this.venue_id],
    });

    this.ingredients.push(newIngredientForm.value);
  }

  //remove(ingredient: Ingredient) {
  remove(ingredient: Ingredient) {
    const ingredientInstance: number = this.getIngredientInstance(ingredient);
    // console.log( "ingredientInstance: ", ingredientInstance )
    // console.log( "this.ingredients[ingredientInstance].id)", this.ingredients[ingredientInstance].id)
    if (ingredient.id) {
      this.ingredientsToDelete.push(this.ingredients[ingredientInstance]);
      // console.log("this.ingredientsToDelete", this.ingredientsToDelete);
    }
    this.ingredients.splice(ingredientInstance, 1);
  }

  toggleGarnish() {
    this.add_pct = !this.add_pct;
  }

  toggleLive() {
    this.live = !this.live;
  }

  updateListPrice(event: any) {
    // console.log("triggered updateRevenue")
    this.gross = event.target.valueAsNumber;
    //this.selectedProductForm.controls["listPriceControl"] = event.target.valueAsNumber;
  }

  updateGarnishDescription(event: any) {
    // console.log("triggered updateRevenue")
    this.garnish_description = event.target.value;
    //this.selectedProductForm.controls["garnishControl"] = event.target.value;
  }

  updatePrepartionMethod(event: any) {
    // console.log("triggered updateRevenue")
    this.preparation_method = event.target.value;
    //this.selectedProductForm.controls["PrepartionControl"] = event.target.value;
  }

  updateGlassToUse(event: any) {
    // console.log("triggered updateRevenue")
    this.glass_to_use = event.target.value;
    //this.selectedProductForm.controls["glassControl"] = event.target.value;
  }

  updateProductName(event: any) {
    this.name = event.target.value;
    //this.selectedProductForm.controls["nameControl"] = event.target.value;
  }

  getIngredientInstance(ingredient) {
    const ingredientInstance: number = this.ingredients.indexOf(ingredient);
    return ingredientInstance;
  }

  getIngredientsToUpdate(ingredients) {
    ingredients.map((ingredient) => {
      //const ingredientInstance: number = this.getIngredientInstance(ingredient)
      if (ingredient.id) {
        this.ingredientsToUpdate.push(ingredient);
      } else {
        this.ingredientsToCreate.push(ingredient);
      }
    });
  }

  public async clearForm() {
    this.name = "Enter Product Name";
    this.margin = null;
    this.gross = null;
    this.add_pct = false;
    this.ingredients = [];
    this.live = false;
    this.cost = 0;
    this.garnish_description = null;
    this.preparation_method = null;
    this.glass_to_use = null;
    this.id = null;

    // if(!this.selectedProduct) {
    //   this.selectedProduct.name = this.name;
    //   console.log("selectedProduct", this.selectedProduct)
    // }
  }

  public async saveProduct() {
    this.getIngredientsToUpdate(this.ingredients);
    const {
      venue_id,
      id,
      ingredientsToDelete,
      ingredientsToUpdate,
      ingredientsToCreate,
      ingredients,
      gross,
      name,
      add_pct,
      margin,
      live,
      cost,
      garnish_description,
      gross_profit,
      preparation_method,
      glass_to_use,
    } = this;

    // const selectedProductIndex =  this.productList.findIndex( (product) => {
    //   return product.product_id === selectedProduct
    // });

    // this.selectedProduct.ingredients = ingredients;
    // this.selectedProduct.gross = gross;
    // this.selectedProduct.name = name;
    // this.selectedProduct.add_pct = add_pct;
    // this.selectedProduct.margin = margin;
    const productChanges = {
      ml: null,
      id,
      venue_id,
      gross,
      name,
      add_pct,
      margin,
      live,
      cost,
      garnish_description,
      gross_profit,
      preparation_method,
      glass_to_use,
    };

    productChanges.ml = this.calculateTotalProductVolume();

    // console.log("productChanges are:", productChanges)
    const ingredientChanges = {
      ingredientsToUpdate,
      ingredientsToDelete,
      ingredientsToCreate,
    };

    console.log("ingredientChanges are:", ingredientChanges);
    this.ingredientsToUpdate = [];
    this.ingredientsToDelete = [];
    this.ingredientsToCreate = [];

    console.log("inside saveProduct");
    console.log("productChanges");
    console.dir(productChanges);
    console.log("ingredientChanges");
    console.dir(ingredientChanges);

    await this.ProductService.updateProduct(productChanges, ingredientChanges);
    this.loadProducts.emit(this.venue_id);

    this.showSelectedProductComponent = false;

    // this.ProductService.updateIngredients(ingredientChanges).then((res) => {
    //   // console.log("results for updateIngredients are", res);
    // });
    this.dialog.closeAll();
  }

  public async deleteProduct() {
    const { ingredientsToDelete, id } = this;
    // const ingredientIdsToDelete:any[] = this.ingredients.map( (ingredient) => {
    //   if( ingredient.id ) {
    //     return ingredient.id
    //   }

    // })

    //this.loadProductsTest(id)
    // console.log("ingredientsToDelete", ingredientIdsToDelete);
    // console.log("ingredientsToDelete", ingredientsToDelete);
    const productIdToDelete: number = id;
    // this.loadProducts.emit(this.venue_id)

    console.log("inside deleteProduct");
    console.log("productIdToDelete");
    console.dir(productIdToDelete);
    console.log("ingredientsToDelete");
    console.dir(ingredientsToDelete);

    await this.ProductService.deleteProduct(
      productIdToDelete,
      ingredientsToDelete
    );
    this.clearForm();
    this.loadProducts.emit(this.venue_id);
    this.showSelectedProductComponent = false;
  }

  public async createProduct() {
    this.getIngredientsToUpdate(this.ingredients);
    const {
      venue_id,
      id,
      ingredientsToCreate,
      gross,
      name,
      add_pct,
      margin,
      live,
      cost,
      garnish_description,
      gross_profit,
      preparation_method,
      glass_to_use,
    } = this;

    // this.selectedProduct.ingredients = ingredients;
    // this.selectedProduct.gross = gross;
    // this.selectedProduct.name = name;
    // this.selectedProduct.add_pct = add_pct;
    // this.selectedProduct.margin = margin;
    const productToCreate = {
      id,
      ml: null,
      venue_id,
      gross,
      name,
      add_pct,
      margin,
      live,
      cost,
      garnish_description,
      gross_profit,
      preparation_method,
      glass_to_use,
    };
    productToCreate.ml = this.calculateTotalProductVolume();

    // console.log("productToCreate is:", productToCreate)
    const ingredientChanges = {
      ingredientsToCreate,
    };

    console.log("ingredientsToCreate are:", ingredientChanges);
    this.ingredientsToUpdate = [];
    this.ingredientsToDelete = [];
    this.ingredientsToCreate = [];

    console.log("inside createProduct");
    console.log("ingredientsToCreate");
    console.dir(ingredientsToCreate);
    console.log("productToCreate");
    console.dir(productToCreate);

    await this.ProductService.createProduct(
      ingredientsToCreate,
      productToCreate
    );

    this.loadProducts.emit(this.venue_id);

    this.clearForm();

    this.showSelectedProductComponent = false;
    this.dialog.closeAll();
    // this.ProductService.updateIngredients(ingredientChanges).then((res) => {
    //   // console.log("results for updateIngredients are", res);
    // });
  }
}
