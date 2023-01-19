import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.less']
})
export class DeleteModalComponent{

  constructor(
    public dialogRef: MatDialogRef<DeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteModalData,
  ) {}

  onDeletePost(){
    this.dialogRef.close(this.data);
  }
}

export interface DeleteModalData{
  heading: string;
  message: string;
  data?: any;
}
