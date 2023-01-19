import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfluencerTeamMemberComponent } from './add-influencer-team-member.component';

describe('AddInfluencerTeamMemberComponent', () => {
  let component: AddInfluencerTeamMemberComponent;
  let fixture: ComponentFixture<AddInfluencerTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInfluencerTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfluencerTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
