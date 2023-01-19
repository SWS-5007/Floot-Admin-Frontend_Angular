import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-sales-entry-modal',
  templateUrl: './sales-entry-modal.component.html',
  styleUrls: ['./sales-entry-modal.component.less']
})
export class SalesEntryModalComponent {

  dates = [];

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: any,
    private dialogRef: MatDialogRef<SalesEntryModalComponent>
  ) {
    
    for(let i = 6; i>=0; i--){
      const date = new Date();
      date.setDate(date.getDate() - i);
      this.dates.push(date.toISOString());
    }
  }

  

}
