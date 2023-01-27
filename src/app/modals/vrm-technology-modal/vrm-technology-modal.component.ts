import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VrmTechData } from 'src/app/containers/vrm-technology-container/vrm-technology-container.component';

@Component({
  selector: 'app-vrm-technology-modal',
  templateUrl: './vrm-technology-modal.component.html',
  styleUrls: ['./vrm-technology-modal.component.less']
})
export class VrmTechnologyModalComponent{

  vrmTechForm = this.fb.nonNullable.group({
    eposTill: '',
    integration: '',
    instaHandle: '',
    instaEnabled: false,
    instaHashtagReq: false,
    dashboardEnabled: false,
    dashboardDataMethod: ''
  })

  readonly displayOptions = {
    eposTill: ['eposnow', 'Vectron', 'Blinq', 'Quorian', 'Pointone', 'Square', 'TakePayments/SmartVolution', 'SumUp'],
    integration: ['Non-integrated','Semi-Integrated', 'Fully Integrated'],
    dashboardDataMethod: ['Tills-Automated', 'API-Automated', 'csv-Manual', 'daily-sales-Manual']
  }

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) data: VrmTechData,
    private dialogRef: MatDialogRef<VrmTechnologyModalComponent>
  ) {
    this.vrmTechForm.setValue({...data});
  }


  onUpdate(){
    const salesCallFormData = this.vrmTechForm.value as VrmTechData;
    this.dialogRef.close(salesCallFormData);
  }

}
