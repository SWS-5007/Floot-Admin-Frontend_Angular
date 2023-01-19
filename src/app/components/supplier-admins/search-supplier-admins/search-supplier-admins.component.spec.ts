import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSupplierAdminsComponent } from './search-supplier-admins.component';

describe('SearchSupplierAdminsComponent', () => {
  let component: SearchSupplierAdminsComponent;
  let fixture: ComponentFixture<SearchSupplierAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSupplierAdminsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSupplierAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
