import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginTrackerComponent } from './margin-tracker.component';

describe('MarginTrackerComponent', () => {
  let component: MarginTrackerComponent;
  let fixture: ComponentFixture<MarginTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarginTrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarginTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
