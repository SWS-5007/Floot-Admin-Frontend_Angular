import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-update-contact-info-modal',
  templateUrl: './update-contact-info-modal.component.html',
  styleUrls: ['./update-contact-info-modal.component.less']
})
export class UpdateContactInfoModalComponent implements OnInit {

  contactInfoForm = this.fb.group({
    email: this.fb.nonNullable.control('', Validators.email),
    phone: '',
  })

  constructor(private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) data: ContactInfoFormData,
    private dialogRef: MatDialogRef<UpdateContactInfoModalComponent>) { }

  ngOnInit(): void {
  }

  onUpdate(){
    if(!this.contactInfoForm.valid)
      return;
    const savedValue = this.contactInfoForm.value as ContactInfoFormData;
    this.dialogRef.close(savedValue);
  }

}

export interface ContactInfoFormData{
  email: string,
  phone: string
}
