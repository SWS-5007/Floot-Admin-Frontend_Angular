
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OpeningTimes } from 'src/app/components/venues/venue-profile/venue-profile.component';
import { EditOpeningTimesModalComponent } from 'src/app/modals/edit-opening-times-modal/edit-opening-times-modal.component';

@Component({
  selector: 'app-opening-times-container',
  templateUrl: './opening-times-container.component.html',
  styleUrls: ['./opening-times-container.component.less']
})
export class OpeningTimesContainerComponent implements OnInit {

  @Input() openingTimes: OpeningTimes;
  @Output() updateOpeningTime = new EventEmitter<OpeningTimes>()

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  convertTimeToString(time: number): string {
    let hours = Math.floor(time/60);
    let minutes = (time - (hours*60));

    return `${hours < 10 ? ('0'+ hours) : hours }:${minutes < 10 ? ('0'+ minutes) : minutes }`;
  }

  onEdit(){
    const dialogRef = this.dialog.open(EditOpeningTimesModalComponent, {
      data: this.openingTimes,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if(result){
        console.log('emit...', result);
        this.updateOpeningTime.emit(result);
      }
    });
  }


}
