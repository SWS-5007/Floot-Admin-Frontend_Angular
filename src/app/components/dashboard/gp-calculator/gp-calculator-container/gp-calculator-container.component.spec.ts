import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpCalculatorContainerComponent } from './gp-calculator-container.component';

describe('GpCalculatorContainerComponent', () => {
  let component: GpCalculatorContainerComponent;
  let fixture: ComponentFixture<GpCalculatorContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpCalculatorContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpCalculatorContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
