import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OpeningTimes } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Component({
  selector: 'app-edit-opening-times-modal',
  templateUrl: './edit-opening-times-modal.component.html',
  styleUrls: ['./edit-opening-times-modal.component.less']
})
export class EditOpeningTimesModalComponent implements OnInit {

  openingTimesForm = new FormGroup({
    monday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    }),
    tuesday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    }),
    wednesday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    }),
    thursday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    }),
    friday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    }),
    saturday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    }),
    sunday: new FormGroup({
      open: new FormControl(''),
      close: new FormControl('')
    })
  })

  constructor(public dialogRef: MatDialogRef<EditOpeningTimesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public openingTimes: OpeningTimes,) {
      let openingTimesValue: any = openingTimes;
      console.log('value', openingTimes);
      daysOfWeek.forEach(day => {
        const formattedObj = {
          open: openingTimesValue[day].open !== null ? this.convertTimeToString(openingTimesValue[day].open): null,
          close: openingTimesValue[day].close !== null ? this.convertTimeToString(openingTimesValue[day].close): null
        }
        openingTimesValue = {...openingTimesValue, [day]: formattedObj};
      });
      this.openingTimesForm.setValue(openingTimesValue);
   }

   convertTimeToString(time: number): string {
    let hours = Math.floor(time/60);
    let minutes = (time - (hours*60));

    return `${hours < 10 ? ('0'+ hours) : hours }:${minutes < 10 ? ('0'+ minutes) : minutes }`;
  }

  public convertStringToTime(string: string): number {
    let hours = string.split(':')[0];
    let minutes = string.split(':')[1];

    return (Number(hours) * 60) + Number(minutes);
  }

  ngOnInit(): void {
  }

  onSave(){
    let updatedValue = this.openingTimesForm.value;
    daysOfWeek.forEach(day => {
      const {open, close} = updatedValue[day];
      const formattedObj = {
        open: open ? this.convertStringToTime(open): null,
        close: close ? this.convertStringToTime(close): null,
      }
      updatedValue = {... updatedValue, [day]: formattedObj};
    })
    console.log(updatedValue);
    this.dialogRef.close(updatedValue);
  }

}

const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];