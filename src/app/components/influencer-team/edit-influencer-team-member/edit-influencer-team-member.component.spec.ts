import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfluencerTeamMemberComponent } from './edit-influencer-team-member.component';

describe('EditInfluencerTeamMemberComponent', () => {
  let component: EditInfluencerTeamMemberComponent;
  let fixture: ComponentFixture<EditInfluencerTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInfluencerTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInfluencerTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
