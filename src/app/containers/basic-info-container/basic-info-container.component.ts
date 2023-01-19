import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicInfo } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Component({
  selector: 'app-basic-info-container',
  templateUrl: './basic-info-container.component.html',
  styleUrls: ['./basic-info-container.component.less']
})
export class BasicInfoContainerComponent implements OnInit {

  @Input() basicInfo: BasicInfo;
  @Input() status: 'active'|'hidden';
  @Input() venueId: string;
  @Input() activePermission: boolean;

  @Output() toggleStatus = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {
  }

  onToggleStatus(){
    const shouldActivate = this.status !== 'active' ? true : false;
    this.toggleStatus.emit(shouldActivate);
  }

}
