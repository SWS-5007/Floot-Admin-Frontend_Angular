import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileData } from 'src/app/components/venues/venue-profile/venue-profile.component';
import transformFile from 'src/app/global/fileReader';

@Component({
  selector: 'app-add-image-modal',
  templateUrl: './add-image-modal.component.html',
  styleUrls: ['./add-image-modal.component.less']
})
export class AddImageModalComponent implements OnInit {

  addImageForm = this.fb.nonNullable.group({
    image: this.fb.nonNullable.control('', Validators.required),
    caption: ''
  },);

  fileData: FileData

  constructor(private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) data: FileData,
    private dialogRef: MatDialogRef<AddImageModalComponent>) {
      if(!data) return;
      this.fileData = {...data};
      this.addImageForm.setValue({image: data.meta.fileName, caption: ''});
  }

  ngOnInit(): void {
  }

  async onImageChange(fileList: FileList): Promise<void> {

    console.log('here..', fileList);

    if (fileList?.length === 1) {
      const file = fileList.item(0);
      if (file.size > 50048576) {
        this.addImageForm.setErrors({
          tooBig: true
        })
        return;
      } 

      this.addImageForm.setErrors(null);
      this.fileData = await transformFile(file)
      this.addImageForm.controls.image.setValue(file.name);
    }
  }

  onSave() {
    console.log(this.fileData);
    const savedValue = this.addImageForm.getRawValue();
    this.dialogRef.close({
      caption: savedValue.caption,
      image: this.fileData,
    })
  }

}

export interface ImageFormData{
  image: FileData,
  caption: string,
}

