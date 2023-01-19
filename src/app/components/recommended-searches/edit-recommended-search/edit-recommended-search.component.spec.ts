import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRecommendedSearchComponent } from './edit-recommended-search.component';

describe('EditRecommendedSearchComponent', () => {
  let component: EditRecommendedSearchComponent;
  let fixture: ComponentFixture<EditRecommendedSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditRecommendedSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRecommendedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
