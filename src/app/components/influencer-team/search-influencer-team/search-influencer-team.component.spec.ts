import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInfluencerTeamComponent } from './search-influencer-team.component';

describe('SearchInfluencerTeamComponent', () => {
  let component: SearchInfluencerTeamComponent;
  let fixture: ComponentFixture<SearchInfluencerTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInfluencerTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInfluencerTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
