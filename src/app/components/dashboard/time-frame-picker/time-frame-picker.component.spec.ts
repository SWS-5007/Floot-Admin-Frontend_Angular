import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFramePickerComponent } from './time-frame-picker.component';

describe('TimeFramePickerComponent', () => {
  let component: TimeFramePickerComponent;
  let fixture: ComponentFixture<TimeFramePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeFramePickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeFramePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
