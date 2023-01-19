import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceDropComponent } from './invoice-drop.component';

describe('InvoiceDropComponent', () => {
  let component: InvoiceDropComponent;
  let fixture: ComponentFixture<InvoiceDropComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvoiceDropComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
