import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierAdminComponent } from './add-supplier-admin.component';

describe('AddSupplierAdminComponent', () => {
  let component: AddSupplierAdminComponent;
  let fixture: ComponentFixture<AddSupplierAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
