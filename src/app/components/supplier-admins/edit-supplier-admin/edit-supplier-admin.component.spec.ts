import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplierAdminComponent } from './edit-supplier-admin.component';

describe('EditSupplierAdminComponent', () => {
  let component: EditSupplierAdminComponent;
  let fixture: ComponentFixture<EditSupplierAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSupplierAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupplierAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
