import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Locale, Vrm } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { UpdateVrmInfoModalComponent, VRMFormData } from 'src/app/modals/update-vrm-info-modal/update-vrm-info-modal.component';

@Component({
  selector: 'app-vrm-info-container',
  templateUrl: './vrm-info-container.component.html',
  styleUrls: ['./vrm-info-container.component.less']
})
export class VrmInfoContainerComponent implements OnInit {

  localeString: string;
  locale: Locale;

  @Input() vrm: Vrm;
  @Input('locale') set _locale(locale: Locale){
    this.localeString = locale ? locale.city + ", " + locale.region + ", " + locale.country : 'No Info';
    this.locale = locale
  }

  @Output() vrmUpdate = new EventEmitter<VRMFormData>();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onUpdateVrm(){
    const dialogRef = this.dialog.open(UpdateVrmInfoModalComponent, {
      width: '300px',
      data: {
        vrm: {...this.vrm}, 
        locale: {...this.locale},
      }
    });

    dialogRef.afterClosed().subscribe((result: VRMFormData) => {
      if(result){
        console.log('vrm update', result);
        this.vrmUpdate.emit(result);
      }
    });
  }

}
