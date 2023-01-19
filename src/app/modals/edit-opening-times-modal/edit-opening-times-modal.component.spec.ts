import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOpeningTimesModalComponent } from './edit-opening-times-modal.component';

describe('EditOpeningTimesModalComponent', () => {
  let component: EditOpeningTimesModalComponent;
  let fixture: ComponentFixture<EditOpeningTimesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditOpeningTimesModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOpeningTimesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
