import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogModalComponent } from './activity-log-modal.component';

describe('ActivityLogModalComponent', () => {
  let component: ActivityLogModalComponent;
  let fixture: ComponentFixture<ActivityLogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityLogModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityLogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
