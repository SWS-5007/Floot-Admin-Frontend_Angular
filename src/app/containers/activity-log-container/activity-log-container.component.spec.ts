import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogContainerComponent } from './activity-log-container.component';

describe('ActivityLogContainerComponent', () => {
  let component: ActivityLogContainerComponent;
  let fixture: ComponentFixture<ActivityLogContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityLogContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityLogContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
