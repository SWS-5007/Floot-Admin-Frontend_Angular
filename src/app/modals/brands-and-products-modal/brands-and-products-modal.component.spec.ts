import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsAndProductsModalComponent } from './brands-and-products-modal.component';

describe('BrandsAndProductsModalComponent', () => {
  let component: BrandsAndProductsModalComponent;
  let fixture: ComponentFixture<BrandsAndProductsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsAndProductsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsAndProductsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
