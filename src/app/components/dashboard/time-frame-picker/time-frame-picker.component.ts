import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import { TimeFrame } from 'src/app/app.component';

@Component({
  selector: 'app-time-frame-picker',
  templateUrl: './time-frame-picker.component.html',
  styleUrls: ['./time-frame-picker.component.less']
})
export class TimeFramePickerComponent implements OnInit {

  @Output() changeTimeFrame = new EventEmitter<TimeFrame>();

  constructor() { }

  ngOnInit(): void {
  }

  setHourly() {
    this.changeTimeFrame.emit(TimeFrame.hourly);
  }

  setDaily() {
    this.changeTimeFrame.emit(TimeFrame.daily);
  }
  
  setWeekly() {
    this.changeTimeFrame.emit(TimeFrame.weekly)
  }

  setMonthly() {
    this.changeTimeFrame.emit(TimeFrame.monthly);
  }

  setYearly() {
    this.changeTimeFrame.emit(TimeFrame.yearly);
  }

}
