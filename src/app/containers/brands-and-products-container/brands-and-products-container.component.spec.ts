import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandsAndProductsContainerComponent } from './brands-and-products-container.component';

describe('BrandsAndProductsContainerComponent', () => {
  let component: BrandsAndProductsContainerComponent;
  let fixture: ComponentFixture<BrandsAndProductsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandsAndProductsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandsAndProductsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
