import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import Ingredient from "../../../../interfaces/ingredient.interface";

@Component({
  selector: "app-ingredient",
  templateUrl: "./ingredient.component.html",
  styleUrls: ["./ingredient.component.less"],
  encapsulation: ViewEncapsulation.None,
})
export class IngredientComponent implements OnInit {
  // form: FormGroup;

  // name = new FormControl('');
  // amount = new FormControl('');
  // rate = new FormControl('');

  ingredientForm = this.fb.group({
    ingredientNameControl: [null],
    ingredientRateControl: [null],
    ingredientMlControl: [null],
  });

  editable = false;
  constructor(private fb: FormBuilder) // @Input() ingredient!: Ingredient,
  // @Input() newIngredient!: string,
  // @Output() remove = new EventEmitter<Ingredient>()
  {
    //this.description = data.description;
  }
  @Input() ingredient!: Ingredient;
  @Input() newIngredient!: string;
  @Input() list: Ingredient[];
  // @Input() calculateLineValueTotal!
  @Output() remove = new EventEmitter<Ingredient>();

  // ingredientForm

  // ingredientForm = this.fb.group(
  //   {
  //     ingredientNameControl: [null],
  //     ingredientRateControl: [null],
  //     ingredientMlControl: [null]
  //   }
  // )

  ngOnInit(): void {
    this.ingredientForm = this.fb.group({
      ingredientNameControl: [this.ingredient.name],
      ingredientRateControl: [
        this.ingredient.rate ? this.ingredient.rate : this.ingredient.inv_rate,
      ],
      ingredientMlControl: [this.ingredient.ml],
    });
  }
  saveIngredient(name: string, ml: number, rate: number, cost: number) {
    if (!name && !ml && !rate && !cost) {
      return;
    }
    this.editable = false;
    this.ingredient.name = name;
    this.ingredient.ml = ml;
    this.ingredient.rate = rate;
    this.ingredient.cost = cost;
  }

  // onKeyPressEvent( event: any ) {
  //   console.dir(event.target)
  //   // this.saveIngredient(event.target.value, event.target.value, event.target.value, event.target.value)
  // }

  updateAmount(event: any) {
    this.ingredient.ml = event.target.valueAsNumber;
    this.updateCost();
    console.log("running updateAmount");
  }

  updateCost() {
    this.ingredient.cost = this.ingredient.ml * this.ingredient.rate;
    // console.log("running LineValue")
  }

  logButtonData(ingredient, list) {
    console.log("ingredient log is:");
    console.log(ingredient);
    console.log("list log is:");
    console.log(list);
  }

  updateName(event: any) {
    this.ingredient.name = event.target.value;
    console.log("running NameAmount");
    //console.dir(event)
    console.log("list is:", this.list);
    //console.log(this.ingredientsList)
    if (event.inputType === "insertReplacementText") {
      const found = this.list.find(
        (element) => element.name === event.target.value
      );
      console.log(found);
      this.ingredient.rate = found.inv_rate || found.rate;
      this.updateCost();
    }
  }

  updateRate(event: any) {
    this.ingredient.rate = event.target.valueAsNumber;
    console.log("running updateRate");
    this.updateCost();
  }

  updateBrand(event: any) {
    this.ingredient.brand = event.target.value;
    console.log("running updateBrand");
  }

  removeIngredient(ingredient: Ingredient) {
    this.remove.emit(ingredient);
  }
}
