import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVenueTeamComponent } from './search-venue-team.component';

describe('SearchVenueTeamComponent', () => {
  let component: SearchVenueTeamComponent;
  let fixture: ComponentFixture<SearchVenueTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchVenueTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVenueTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
