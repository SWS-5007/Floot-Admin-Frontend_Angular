import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateVrmInfoModalComponent } from '../update-vrm-info-modal/update-vrm-info-modal.component';

@Component({
  selector: 'app-activity-log-modal',
  templateUrl: './activity-log-modal.component.html',
  styleUrls: ['./activity-log-modal.component.less']
})
export class ActivityLogModalComponent {

  addActivityForm = this.fb.nonNullable.group({
    activityType: this.fb.nonNullable.control('', Validators.required),
    comment: this.fb.nonNullable.control('', Validators.required),
    activityDate: this.fb.nonNullable.control('', Validators.required),
  });

  readonly activityTypes = ['Visit', 'Call', 'Meeting'];
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateVrmInfoModalComponent>
  ) { }

  onUpdate(){
    if(!this.addActivityForm.valid) return;
    const savedValue = this.addActivityForm.value as ActivityFormData;
    this.dialogRef.close(savedValue);
  }
}

export interface ActivityFormData{
  activityType: string;
  comment: string;
  activityDate: string;
}
