import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVrmInfoModalComponent } from './update-vrm-info-modal.component';

describe('UpdateVrmInfoModalComponent', () => {
  let component: UpdateVrmInfoModalComponent;
  let fixture: ComponentFixture<UpdateVrmInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateVrmInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVrmInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
