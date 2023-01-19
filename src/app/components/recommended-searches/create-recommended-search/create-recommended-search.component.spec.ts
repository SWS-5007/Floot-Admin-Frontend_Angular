import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecommendedSearchComponent } from './create-recommended-search.component';

describe('CreateRecommendedSearchComponent', () => {
  let component: CreateRecommendedSearchComponent;
  let fixture: ComponentFixture<CreateRecommendedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecommendedSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateRecommendedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
