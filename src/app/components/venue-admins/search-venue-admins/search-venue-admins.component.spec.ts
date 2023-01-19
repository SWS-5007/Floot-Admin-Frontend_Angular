import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVenueAdminsComponent } from './search-venue-admins.component';

describe('SearchVenueAdminsComponent', () => {
  let component: SearchVenueAdminsComponent;
  let fixture: ComponentFixture<SearchVenueAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchVenueAdminsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVenueAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
