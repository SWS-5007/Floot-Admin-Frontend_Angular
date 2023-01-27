import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-brands-and-products-modal',
  templateUrl: './brands-and-products-modal.component.html',
  styleUrls: ['./brands-and-products-modal.component.less']
})
export class BrandsAndProductsModalComponent {

  brandsAndProductsForm = this.fb.nonNullable.group({
    wholesaler: '',
    brandsToWatch: [],
    agreements: [],
  });

  orderedAgreements = [];

  get brandsToWatch(): FormControl{
    return this.brandsAndProductsForm.get('brandsToWatch') as FormControl;
  }

  get agreements(): FormControl{
    return this.brandsAndProductsForm.get('agreements') as FormControl;
  }

  readonly brandOptions = ['Aperol', 'Portobello', 'Southern Comfort'];
  readonly listingTypes = ['speed rail', 'menu', 'backbar'];
  readonly wholesalerOptions = ['Libra', 'Kater4', 'Matthew Clark', 'LWC', 'Heineken'];

  readonly mockAgreements = ['Aperol', 'Portobello', 'Southern Comfort', 'speed rail', 'menu', 'backbar', 'Libra', 'Kater4', 'Matthew Clark', 'LWC', 'Heineken'];

  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<BrandsAndProductsModalComponent>
  ) { 
    console.log('data', data);
    this.brandsAndProductsForm.patchValue({
      brandsToWatch: data
    });
    this.onModifyAgreements();
  }

  onSave(){
    console.log('form', this.brandsAndProductsForm.valid, this.brandsAndProductsForm.value);
    if(!this.brandsAndProductsForm.valid) return;
    const savedValue = this.brandsAndProductsForm.value as brandsAndProductsFormData;
    savedValue.agreements = [...this.orderedAgreements];
  
    this.dialogRef.close(savedValue);
  }

  onModifyAgreements(){
    this.agreements.valueChanges.subscribe(value => {
      this.orderedAgreements = [...value];
    })
  }

  isOptionDisabled(value: string){
    return this.agreements.value?.length >= 5 && !((this.agreements.value ?? []).includes(value));
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.orderedAgreements, event.previousIndex, event.currentIndex);
  }

}

export interface brandsAndProductsFormData{
  wholesaler: string;
  brandsToWatch: {brand: string; listingType: string}[];
  agreements: string[]
}
