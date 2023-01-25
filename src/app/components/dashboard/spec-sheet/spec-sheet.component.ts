import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ErrorHandlerService } from 'src/app/services/core/error-handler.service';
import { PendingSaveService } from 'src/app/services/core/pending-save.service';
import { AuthService } from 'src/app/services/identity/auth.service';
import { environment } from 'src/environments/environment';

// OLIS CODE
import { ProductService } from "../../../services/gp-calculator/gp-calculator.service";
//import Product from "../../../../interfaces/ingredient.interface";

// END OLIS CODE

// OLIS CODE
interface Ingredient {
  id: number,
  name: string,
  brand: string,
  product_id: number,
  venue_id: number,
  ml: number,
  cost: number,
  rate: number,
  inv_updated: number,
  inv_cost: number,
  inv_rate: number,
  supplier_id: number,
  gross: number
}

interface Product {
  id: number
  name: string,
  venue_id: number
  add_pct: boolean,
  margin: number,
  live: boolean,
  cost: number,
  gross: number,
  gross_profit: number,
  preparation_method: string,
  glass_to_use: string,
  garnish_description: string,
  ml: number,
  ingredients: Ingredient[];
}

// END OLIS CODE



interface Supplier {
  id: string,
  name: string,
  profileImageUrl: string | null,
  coverImageUrl: string | null,
  tagline: string,
  websiteUrl: string | null,
  contactForms: ContactForm[] | null,
}

interface ContactForm {
  id: string,
  title: string,
  description: string | null,
  fields: ContactFormField[]
}

interface ContactFormField {
  id: string | null,
  label: string | null,
  type: "text" | "number" | "file" | null,
}

interface ContactFormFieldSubmission {
  id: string | null,
  label: string | null,
  value: any,
}

@Component({
  selector: 'app-spec-sheet',
  templateUrl: './spec-sheet.component.html',
  styleUrls: ['./spec-sheet.component.less']
})
export class SpecSheetComponent implements OnInit {

  public suppliers: Supplier[] = [];

  public selectedSupplierIndex: number = -1;
  public selectedFormIndex: number = -1;

  public contactForm: FormGroup = null;

  public formFileError: boolean = null;

  public selectedFormFile: any = null;

  public flag: any = null;

  public notificationSupplierIndex: number = -1;
  public showFormSent: boolean = false;

  // OLIS CODE
  public productList: Product[];
  public productListCopy: Product[];
  public ingredientsList = [];

  public ingredientsToDelete = [];

  selectedProduct: Product;
  selectedProductId: number;
  venue_id: number = 1;

  //END OLIs CODE

  constructor(
    private errorHandlerService: ErrorHandlerService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,

    // OLIS CODE
    private ProductService: ProductService,
    private fb: FormBuilder,
    //END OLIS CODE
  ) {
    this.contactForm = null
    this.loadData();
  }



  // OLI's CODE

  updateName(event: any, indgredientIdx) {
    console.log("click")
    console.log(event.target.value)
    // this.ingredient.name = event.target.value;
    // console.log("running NameAmount");
    // //console.dir(event)
    // console.log("list is:", this.list);
    // //console.log(this.ingredientsList)
    // if (event.inputType === "insertReplacementText") {
    const found = this.ingredientsList.find(
      (element) => element.name === event.target.value
    );
    console.log(found);
    const newInvRate = found.inv_rate
    const newRate = found.rate;
    // if (this.ingredients.value[indgredientIdx]   ingredientForm.value.inv_rate) {
    //   ingredientForm.value.inv_rate  = parseFloat(newRate)
    // } else {
    //   ingredientForm.value.rate = parseFloat(newRate)
    // }
    //updat
    //console.log(this.ingredients.controls[indgredientIdx])
    // this.ingredients.controls[indgredientIdx].value.rate = parseFloat(newRate)
    // this.ingredients.controls[indgredientIdx].value.inv_rate = parseFloat(newInvRate)

    this.ingredients.controls[indgredientIdx].get('inv_rate').setValue(parseFloat(newInvRate))
    this.ingredients.controls[indgredientIdx].get('rate').setValue(parseFloat(newRate))

    this.calculateGPPTotal()
    }



  public async loadProducts() {
    const res = await this.ProductService.getProducts(this.venue_id);
    console.log("loadProducts");
    console.log("res is: ")
    console.log(res)
    this.productList = res;
    this.productListCopy = [...res];
    console.log("productList is:", this.productList);
  }

  refreshProductList(): void {
    this.loadProducts();
  }

  async loadIngredients() {
    this.ingredientsList = await this.ProductService.getingredients(
      this.venue_id
    );
  }


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

  calculateLineValueTotal() {
    //const ingredientsArray = this.ingredients
    const total = this.ingredients.value.reduce((total, currVal) => {

      // console.log("name", currVal.name)
      // console.log("inv_rate",currVal.inv_rate)
      // console.log("rate",currVal.rate)
      // console.log("ingredient_ml",currVal.ingredient_ml)
      // console.log( `${currVal.inv_rate * currVal.ingredient_ml|| currVal.rate * currVal.ingredient_ml}`)
      
      
      
      
      return total + (currVal.inv_rate * currVal.ingredient_ml || currVal.rate * currVal.ingredient_ml);
    }, 0);
    // console.log("triggered calculateLineValueTotal")
    //this.lineValueTotal = total;
    return total;
    //console.log(this.ingredients.value)
    // this.ingredients.value.forEach(currVal => {
    //   console.log("name", currVal.name)
    //   console.log("inv_rate",currVal.inv_rate)
    //   console.log("rate",currVal.rate)
    //   console.log("ingredient_ml",currVal.ingredient_ml)
    //   console.log( `${currVal.inv_rate * currVal.ingredient_ml|| currVal.rate * currVal.ingredient_ml}`)
    // });

    // return 10
  }

  calculateGPPTotal() {
    //console.log("triggered calculateGPPTotal")
    const lineValueTotal = this.calculateLineValueTotal();
    let margin = null;
    let grossProfit = null;
    if (this.selectedProductForm.value.add_pct) {
      let garnishCost = (lineValueTotal / 100) * 5;
      grossProfit = this.selectedProductForm.value.gross - (lineValueTotal + garnishCost);
      margin = (grossProfit / this.selectedProductForm.value.gross) * 100;
    } else {
      grossProfit = this.selectedProductForm.value.gross - lineValueTotal;
      margin = (grossProfit / this.selectedProductForm.value.gross ) * 100;
    }
    // if ( margin === null ) {
    //   margin = 0
    // }
    return {
      margin,
      grossProfit
    };
  }

  // calculateTotalProductVolume() {
  //   const totalVolume = this.ingredients.reduce((total, currVal) => {
  //     return total + currVal.ml;
  //   }, 0);
  //   return totalVolume;
  // }



  // onSelect() {
  //   // console.log("inside onSelect")
  //   // console.log(this.product.id)
  //   // console.log(this.product)

  //   //  this.selectedProduct.emit(this.product.id);
  //   let dialogRef = this.dialogModel.open(SelectedProductComponent, {
  //     width: "100%",
  //     height: "550px",
  //   });
  //   dialogRef.componentInstance.addProduct = true;
  // }


  // Grab all the inputs in the edit product modal and fill them with the selected product info


  selectedProductForm = this.fb.group({
    id: [null],
    name: [null],
    gross: [null],
    garnish_description: [null],
    preparation_method: [null],
    glass_to_use: [null],
    ingredients: this.fb.array([]),
    live: [false],
    add_pct: [false],
    margin: [null],
    cost: [null]
  });
  
  // ingredientForm = this.fb.group({
  //   ingredientNameControl: [null],
  //   ingredientRateControl: [null],
  //   ingredientMlControl: [null]
  // });

  calculateTotalProductVolume() {
    const totalVolume = this.ingredients.value.reduce((total, currVal) => {
      return total + currVal.ingredient_ml;
    }, 0);
    return totalVolume;
  }

  getIngredientsToUpdate(ingredients) {
    let ingredientsToUpdate = [];
    let ingredientsToCreate = [];
    ingredients.value.map((ingredient) => {
      //const ingredientInstance: number = this.getIngredientInstance(ingredient)
      ingredient.ingredient_ml = parseFloat(ingredient.ingredient_ml)
      if (ingredient.product_ingredient_id) {
        ingredientsToUpdate.push(ingredient);
      } else {
        ingredientsToCreate.push(ingredient);
      }
    });
    return {
      ingredientsToUpdate,
      ingredientsToCreate
    }
  }
  public async deleteProduct() {
    console.log("hit delete")
    const { ingredientsToDelete, selectedProductForm } = this;
    // const ingredientIdsToDelete:any[] = this.ingredients.map( (ingredient) => {
    //   if( ingredient.id ) {
    //     return ingredient.id
    //   }

    // })

    //this.loadProductsTest(id)
    // console.log("ingredientsToDelete", ingredientIdsToDelete);
    // console.log("ingredientsToDelete", ingredientsToDelete);
    const productIdToDelete: number = selectedProductForm.value.id;
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
    this.ingredientsToDelete = [];
    //this.clearForm();
    //this.loadProducts.emit(this.venue_id);
    //this.showSelectedProductComponent = false;
    this.visible = !this.visible
    this.loadProducts();
  }

  


  public async createProduct() {
    const ingredientsToChange = this.getIngredientsToUpdate(this.ingredients)
    const GppTotal = this.calculateGPPTotal()
    const totalVolume = this.calculateTotalProductVolume()
    const productToCreate = {
      ml: totalVolume,
      id: null,
      venue_id: this.venue_id,
      gross: parseFloat(this.selectedProductForm.value.gross),
      name: this.selectedProductForm.value.name,
      add_pct: this.selectedProductForm.value.add_pct,
      margin: GppTotal.margin,
      live: this.selectedProductForm.value.live,
      cost: this.selectedProductForm.value.gross,
      garnish_description: this.selectedProductForm.value.garnish_description,
      gross_profit: GppTotal.grossProfit,
      preparation_method: this.selectedProductForm.value.preparation_method,
      glass_to_use: this.selectedProductForm.value.glass_to_use
    };

    productToCreate.ml = this.calculateTotalProductVolume();

    console.log("product is: ", this.selectedProductForm)
    console.log("productToCreate is:", productToCreate)

    const ingredientChanges = {
      ingredientsToCreate: ingredientsToChange.ingredientsToCreate,
    };

    console.log("ingredientChanges are:", ingredientChanges);
    // this.ingredientsToUpdate = [];

    await this.ProductService.createProduct(
      ingredientChanges.ingredientsToCreate,
      productToCreate
    );

    this.ingredientsToDelete = [];
    this.loadProducts();
    this.visible = !this.visible

  }
  public async saveProduct(product) {
    console.log("inside save product. Product is:")
    console.log(product)
    console.log("selectedProductForm is:")
    console.log(this.selectedProductForm)
    const ingredientsToChange = this.getIngredientsToUpdate(this.ingredients)
    

    // public async saveProduct() {
      //this.getIngredientsToUpdate(this.ingredients);
      // const {
      //   venue_id,
      //   id,
      //   ingredientsToDelete,
      //   ingredientsToUpdate,
      //   ingredientsToCreate,
      //   ingredients,
      //   gross,
      //   name,
      //   add_pct,
      //   margin,
      //   live,
      //   cost,
      //   garnish_description,
      //   gross_profit,
      //   preparation_method,
      //   glass_to_use,
      // } = this;
  
      // const selectedProductIndex =  this.productList.findIndex( (product) => {
      //   return product.product_id === selectedProduct
      // });
  
      // this.selectedProduct.ingredients = ingredients;
      // this.selectedProduct.gross = gross;
      // this.selectedProduct.name = name;
      // this.selectedProduct.add_pct = add_pct;
      // this.selectedProduct.margin = margin;


      const GppTotal = this.calculateGPPTotal()
      const totalVolume = this.calculateTotalProductVolume()
      const productChanges = {
        ml: totalVolume,
        id: product.id,
        venue_id: product.venue_id,
        gross: parseFloat(this.selectedProductForm.value.gross),
        name: this.selectedProductForm.value.name,
        add_pct: this.selectedProductForm.value.add_pct,
        margin: GppTotal.margin,
        live: this.selectedProductForm.value.live,
        cost: this.selectedProductForm.value.gross,
        garnish_description: this.selectedProductForm.value.garnish_description,
        gross_profit: GppTotal.grossProfit,
        preparation_method: this.selectedProductForm.value.preparation_method,
        glass_to_use: this.selectedProductForm.value.glass_to_use
      };
  
      productChanges.ml = this.calculateTotalProductVolume();
  
      console.log("product is: ", product)
      console.log("productChanges are:", productChanges)

      const ingredientChanges = {
        ingredientsToUpdate: ingredientsToChange.ingredientsToUpdate,
        ingredientsToDelete: this.ingredientsToDelete,
        ingredientsToCreate: ingredientsToChange.ingredientsToCreate,
      };
  
      console.log("ingredientChanges are:", ingredientChanges);
      // this.ingredientsToUpdate = [];
      // this.ingredientsToDelete = [];
      // this.ingredientsToCreate = [];
  
      // console.log("inside saveProduct");
      // console.log("productChanges");
      //console.dir(productChanges);
      // console.log("ingredientChanges");
      // console.dir(ingredientChanges);
  
      await this.ProductService.updateProduct(productChanges, ingredientChanges);
      
      
      //this.loadProducts.emit(this.venue_id);
      this.ingredientsToDelete = [];
      this.loadProducts();
      this.visible = !this.visible

      

  }

  testClick(idx) {
    console.log("testClick")
    console.log(this.ingredients.value[idx].inv_rate)
  }
  addIngredient(product) {
    // this.ingredients.push({
    //   name: "",
    //   brand: "",
    //   ml: 0,
    //   rate: 0,
    //   cost: 0,
    //   product_id: this.id,
    //   venue_id: this.venue_id
    // });
    console.log("hit add ingredient")
    // ingredientNameControl: [null],
    // ingredientRateControl: [null],
    // ingredientMlControl: [null],
    const newIngredientForm = this.fb.group({
      name: [""],
      brand: [null],
      ml: [0],
      ingredient_ml: [0],
      inv_rate: [0],
      rate: [null],
      cost: [0],
      product_id: [product.id] || null,
      venue_id: [this.venue_id],
    });

    this.ingredients.push(newIngredientForm);
    // product.ingredients.push({
    //   name: "",
    //   brand: null,
    //   ml: 0,
    //   rate: 0,
    //   cost: 0,
    //   product_id: product.id,
    //   venue_id: product.venue_id
    // })
  }

  // getIngredientInstance(ingredient, product) {
  //   const ingredientInstance: number = product.ingredients.indexOf(ingredient);
  //   return ingredientInstance;
  // }



  // removeIngredient(ingredient: Ingredient, product) {
  removeIngredient(product, idx) {
    //const ingredientInstance: number = this.getIngredientInstance(ingredient, product);

    // console.log( "ingredientInstance: ", ingredientInstance )
    // console.log( "this.ingredients[ingredientInstance].id)", this.ingredients[ingredientInstance].id)
    // if (ingredient.id) {
    //   this.ingredientsToDelete.push(this.ingredients[ingredientInstance]);
    //   // console.log("this.ingredientsToDelete", this.ingredientsToDelete);
    // }

      console.log(idx)
      //this.ingredientsToDelete.push(this.ingredients[ingredientInstance]);
      if (product) {
        this.ingredientsToDelete.push(product.ingredients[idx])
      }
      this.ingredients.removeAt(idx)
      this.calculateGPPTotal()


    //product.ingredients.splice(ingredientInstance, 1);
  }




  /// END OLI's CODE

  private async loadData(): Promise<void> {
    try {
      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/venues/get-suppliers', {
        token: this.authService.getAuthenticationState().authenticationToken,
      }).toPromise();


      if(request.status === 'ok') {
        
        this.suppliers = request.responseData.suppliers.sort((a, b) => a.name.toLowerCase() !== b.name.toLowerCase)
       // OLIS CODE

        //this.venue_id = 1;
        this.loadProducts();
        this.loadIngredients();


       //END OLIS CODE
      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not load the suppliers.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not load the suppliers.',
        unsanitizedMessage: error
      });

    }
  }

  public async sendContactForm(): Promise<void> {
    try {

      if (!this.contactForm || !this.contactForm.valid) {
        return;
      }

      const request: any = await this.http.post(environment.api + '/api/admin/suppliers/venues/submit-supplier-contact-form', {
        token: this.authService.getAuthenticationState().authenticationToken,
        contactFormId: this.suppliers[this.selectedSupplierIndex].contactForms[this.selectedFormIndex].id,
        supplierForm: this.formatContactFormSubmission(this.contactForm.value, this.selectedSupplierIndex, this.selectedFormIndex)
      }).toPromise();

      if(request.status === 'ok') {
        
        this.notificationSupplierIndex = this.selectedSupplierIndex;
        this.selectedSupplierIndex = -1;
        this.selectedFormIndex = -1;
        this.contactForm = new FormGroup({})
        this.selectedFormFile = null;

        this.showFormSent = true;
        
        setTimeout(() => {
          this.showFormSent = false;
        }, 5000)

      }
      else {
        this.errorHandlerService.throwError({
          displayMessage: 'Could not submit the contact form.',
          unsanitizedMessage: 'No stack trace.'
        });
      }

    }
    catch(error) {
      this.errorHandlerService.throwError({
        displayMessage: 'Could not submit the contact form.',
        unsanitizedMessage: error
      });

    }
  }

  public formatContactFormSubmission(form: any, supplierIndex: number, formIndex: number): ContactFormFieldSubmission[] {
    try {

      let formattedFields = [];

      const ids = Object.keys(form);
      const values = Object.values(form)

      for (let i = 0; i < ids.length; i++) {

        const indexOfField = this.suppliers[supplierIndex].contactForms[formIndex].fields.findIndex(x => x.id === ids[i])

        formattedFields.push({
          id: ids[i],
          type: this.suppliers[supplierIndex].contactForms[formIndex].fields[indexOfField].type,
          value: this.suppliers[supplierIndex].contactForms[formIndex].fields[indexOfField].type === 'file' ? this.selectedFormFile : values[i]
        })

        // this.selectedFormFile = null;

      }

      return formattedFields;
    }
    catch(error) {
      throw error;
    }
  }

  public openContactForm(supplier: Supplier, index: number, formIndex: number): void {
    try {

      

      if (!supplier || !supplier.contactForms || index < 0) {
        
        return;
      }

      this.contactForm = new FormGroup({})

      for (let index = 0; index < supplier.contactForms[formIndex].fields.length; index++) {
        const element = supplier.contactForms[formIndex].fields[index];

        this.contactForm.addControl(element.id, new FormControl('', Validators.required))
        
      }

    }
    catch(error) {
      throw error;
    }
  }
  ReadMore:boolean = true

  //hiding info box
  visible:boolean = false
  newProduct() {
      this.selectedProductForm = this.fb.group({
        id: [null],
        name: [""],
        gross: [0],
        garnish_description: [""],
        preparation_method: [""],
        glass_to_use: [""],
        ingredients: this.fb.array([]),
        live: [false],
        add_pct: [false],
        margin: [0],
        cost: [null]
  
        // add_pct: boolean,
        // margin: number,
        // live: boolean,
      });
  }

  //onclick toggling both
  onclick(flag, product)
  {
    // console.log(`hello from onClick. Flag is:`)
    // console.log(`${flag}`)
    this.getProductData(product)
    this.flag=flag
    this.ReadMore = !this.ReadMore; //not equal to condition
    this.visible = !this.visible
    console.log(this.selectedProductForm)
    console.log(this.ingredients)
    
  }

  get ingredients() {
    return this.selectedProductForm.controls["ingredients"] as FormArray
  }

  getProductData(product) {
    console.log(product)
    this.selectedProductForm = this.fb.group({
      id: [product.id],
      name: [product.name],
      gross: [product.gross],
      garnish_description: [product.garnish_description],
      preparation_method: [product.preparation_method],
      glass_to_use: [product.glass_to_use],
      ingredients: this.fb.array([]),
      live: [product.live],
      add_pct: [product.add_pct],
      margin: product.margin,
      cost: product.cost

      // add_pct: boolean,
      // margin: number,
      // live: boolean,
    });
    //this.selectedProductForm.controls["product.ingredients"] as FormArray;

    // const newIngredientForm = this.fb.group({
    //   name: [""],
    //   brand: [null],
    //   ml: [0],
    //   rate: [0],
    //   cost: [0],
    //   product_id: [product.id],
    //   venue_id: [product.venue_id],
    // });


    // ingredientNameControl: [""],
    // brand: [null],
    // ingredientMlControl: [0],
    // ingredientRateControl: [0],
    // cost: [0],
    // product_id: [product.id],
    // venue_id: [product.venue_id],


    // product.ingredients.push(newIngredientForm.value);
    if (product.ingredients) {
      for (let ingredient of product.ingredients) {
        const newIngredientForm = this.fb.group({
          name: [ingredient.name],
          brand: [null],
          ml: [ingredient.ml],
          ingredient_ml: [ingredient.ingredient_ml],
          inv_rate: [ingredient.inv_rate],
          rate: [ingredient.rate],
          inv_cost: [ingredient.inv_cost],
          cost: [ingredient.cost],
          ingredient_id: [ingredient.ingredient_id],
          product_ingredient_id: [ingredient.product_ingredient_id],
          product_id: [ingredient.product_id],
          venue_id: [ingredient.venue_id]
        });
        this.ingredients.push(newIngredientForm)
      }


    }

  }

  public dismissContactForm(): void {
    try {

      this.contactForm = null

      return;

    }
    catch(error) {
      throw error;
    }
  }

  public onFormFileSelected(event: any): void {

    var reader = new FileReader();
    
    if (event.target.files.length === 1) {

      if (event.target.files[0].size > 50048576) {

        this.formFileError = true

      } else {

        this.formFileError = false

        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (readerLoadEvent) => {
          this.selectedFormFile = {
            buffer: readerLoadEvent.target.result,
            meta: {
              fileName: event.target.files[0].name,
              fileType: event.target.files[0].type
            }
          }
        }
      }
    }
  }

  ngOnInit(): void {
    console.log("hello from Oliver")
  }

}
