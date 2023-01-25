import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareSuppliersModalComponent } from './compare-suppliers-modal.component';

describe('CompareSuppliersModalComponent', () => {
  let component: CompareSuppliersModalComponent;
  let fixture: ComponentFixture<CompareSuppliersModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompareSuppliersModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompareSuppliersModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
