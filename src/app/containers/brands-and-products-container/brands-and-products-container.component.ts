import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { brandsAndProductsFormData, BrandsAndProductsModalComponent } from 'src/app/modals/brands-and-products-modal/brands-and-products-modal.component';

@Component({
  selector: 'app-brands-and-products-container',
  templateUrl: './brands-and-products-container.component.html',
  styleUrls: ['./brands-and-products-container.component.less']
})
export class BrandsAndProductsContainerComponent{


  @Input() brandsAndProductsData: brandsAndProductsFormData = {
    wholesaler: '',
    brandsToWatch: [],
    agreements: ['Aperol', 'Portobello', 'Southern Comfort', 'speed rail', 'menu']
  };

  @Output() updateBrandInfo = new EventEmitter<brandsAndProductsFormData>()

  constructor(public dialog: MatDialog) { }

  onUpdate(){
    const dialog = this.dialog.open(BrandsAndProductsModalComponent, {
      width: '300px',
      data: this.brandsAndProductsData
    })
    dialog.afterClosed().subscribe((result: brandsAndProductsFormData) => {
      if(result){
        this.updateBrandInfo.emit(result);
      }
    })
  }

}
