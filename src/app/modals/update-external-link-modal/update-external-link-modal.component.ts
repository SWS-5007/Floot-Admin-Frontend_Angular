import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ExternalLink } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Component({
  selector: 'app-update-external-link-modal',
  templateUrl: './update-external-link-modal.component.html',
  styleUrls: ['./update-external-link-modal.component.less']
})
export class UpdateExternalLinkModalComponent implements OnInit {

  externalLinkForm = this.fb.group({
    text: this.fb.nonNullable.control('', Validators.required),
    url: this.fb.nonNullable.control('', Validators.required),
  })

  constructor(private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) data: ExternalLink,
    private dialogRef: MatDialogRef<UpdateExternalLinkModalComponent>) {
    if(data != null){
      this.externalLinkForm.setValue(data);
    }
   }

  ngOnInit(): void {
  }

  onUpdate(){
    if(!this.externalLinkForm.valid)
      return;
    const savedValue = this.externalLinkForm.value as ExternalLink;
    this.dialogRef.close(savedValue);
  }

}
