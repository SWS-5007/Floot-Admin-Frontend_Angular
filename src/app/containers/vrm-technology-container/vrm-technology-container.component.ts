import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { VrmTechnologyModalComponent } from 'src/app/modals/vrm-technology-modal/vrm-technology-modal.component';

@Component({
  selector: 'app-vrm-technology-container',
  templateUrl: './vrm-technology-container.component.html',
  styleUrls: ['./vrm-technology-container.component.less']
})
export class VrmTechnologyContainerComponent implements OnInit {

  @Input() vrmTech: VrmTechData;
  @Output() updateTech = new EventEmitter<VrmTechData>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onUpdate(){
    const dialogRef = this.dialog.open(VrmTechnologyModalComponent, {
      data: {...this.vrmTech}
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        console.log('before emit', result);
        this.updateTech.emit(result);
      }
    })
  }

}

export interface VrmTechData{
  eposTill: string,
  integration: string,
  instaHandle: string,
  instaEnabled: boolean,
  instaHashtagReq: boolean,
  dashboardEnabled: boolean,
  dashboardDataMethod: string
}
