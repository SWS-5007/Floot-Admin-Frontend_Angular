import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierSpaceComponent } from './supplier-space.component';

describe('SupplierSpaceComponent', () => {
  let component: SupplierSpaceComponent;
  let fixture: ComponentFixture<SupplierSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
