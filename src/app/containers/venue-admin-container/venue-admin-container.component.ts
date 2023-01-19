import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { VenueAdmin } from 'src/app/components/venues/venue-profile/venue-profile.component';

@Component({
  selector: 'app-venue-admin-container',
  templateUrl: './venue-admin-container.component.html',
  styleUrls: ['./venue-admin-container.component.less']
})
export class VenueAdminContainerComponent implements OnInit {

  @Input() venueAdmins: VenueAdmin[];

  @Output() createAdmin = new EventEmitter();
  @Output() editAdmin = new EventEmitter<string>();
  @Output() deleteAdmin = new EventEmitter<string>();
  
  constructor() { }

  ngOnInit(): void {
  }

}
