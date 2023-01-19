import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVenueTeamMemberComponent } from './add-venue-team-member.component';

describe('AddVenueTeamMemberComponent', () => {
  let component: AddVenueTeamMemberComponent;
  let fixture: ComponentFixture<AddVenueTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVenueTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVenueTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
