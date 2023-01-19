import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVenueTeamMemberComponent } from './edit-venue-team-member.component';

describe('EditVenueTeamMemberComponent', () => {
  let component: EditVenueTeamMemberComponent;
  let fixture: ComponentFixture<EditVenueTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVenueTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVenueTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
