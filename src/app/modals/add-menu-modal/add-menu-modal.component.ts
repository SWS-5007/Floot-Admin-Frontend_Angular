import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileData } from 'src/app/components/venues/venue-profile/venue-profile.component';
import transformFile from 'src/app/global/fileReader';

@Component({
  selector: 'app-add-menu-modal',
  templateUrl: './add-menu-modal.component.html',
  styleUrls: ['./add-menu-modal.component.less']
})
export class AddMenuModalComponent implements OnInit {

  addMenuForm = this.fb.nonNullable.group({
    pdf: this.fb.nonNullable.control('', Validators.required),
    title: this.fb.nonNullable.control('', Validators.required)
  },);

  fileData: FileData

  constructor(private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) data: FileData,
    private dialogRef: MatDialogRef<AddMenuModalComponent>) {
      if(!data) return;
      this.fileData = {...data};
      this.addMenuForm.setValue({pdf: data.meta.fileName, title: ''});
  }

  ngOnInit(): void {
  }

  async onMenuChange(fileList: FileList): Promise<void> {

    console.log('here..', fileList);

    if (fileList?.length === 1) {
      const file = fileList.item(0);
      if (file.size > 50048576) {
        this.addMenuForm.setErrors({
          tooBig: true
        })
        return;
      } 

      this.addMenuForm.setErrors(null);
      this.fileData = await transformFile(file)
      this.addMenuForm.controls.pdf.setValue(file.name);
    }
  }

  onSave() {
    console.log(this.fileData);
    const savedValue = this.addMenuForm.getRawValue();
    this.dialogRef.close({
      title: savedValue.title,
      pdf: this.fileData,
    })
  }

}

export interface AddMenuForm{
  title: string,
  pdf: FileData
}
