import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchReportedActivityComponent } from './search-reported-activity.component';

describe('SearchReportedActivityComponent', () => {
  let component: SearchReportedActivityComponent;
  let fixture: ComponentFixture<SearchReportedActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchReportedActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchReportedActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
