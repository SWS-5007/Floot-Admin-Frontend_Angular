import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchVenuesComponent } from './search-venues.component';

describe('SearchVenuesComponent', () => {
  let component: SearchVenuesComponent;
  let fixture: ComponentFixture<SearchVenuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchVenuesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchVenuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
