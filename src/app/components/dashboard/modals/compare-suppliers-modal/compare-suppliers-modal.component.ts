import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-compare-suppliers-modal',
  templateUrl: './compare-suppliers-modal.component.html',
  styleUrls: ['./compare-suppliers-modal.component.less']
})
export class CompareSuppliersModalComponent{

  constructor(
    public dialogRef: MatDialogRef<CompareSuppliersModalComponent>,
  ) {}

  onConfirm(){
    this.dialogRef.close(true);
  }

}
