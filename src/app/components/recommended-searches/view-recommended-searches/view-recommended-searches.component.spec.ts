import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRecommendedSearchesComponent } from './view-recommended-searches.component';

describe('ViewRecommendedSearchesComponent', () => {
  let component: ViewRecommendedSearchesComponent;
  let fixture: ComponentFixture<ViewRecommendedSearchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewRecommendedSearchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRecommendedSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
