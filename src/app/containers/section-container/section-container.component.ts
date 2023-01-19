import { Component, OnInit, Input } from '@angular/core';
import { BasicInfo } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Component({
  selector: 'app-section-container',
  templateUrl: './section-container.component.html',
  styleUrls: ['./section-container.component.less']
})
export class SectionContainerComponent implements OnInit {

  @Input() basicInfo: BasicInfo;
  
  constructor() { }

  ngOnInit(): void {
  }

}
