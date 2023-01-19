import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImageModalComponent } from './add-image-modal.component';

describe('AddImageModalComponent', () => {
  let component: AddImageModalComponent;
  let fixture: ComponentFixture<AddImageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddImageModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
