import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesEntryModalComponent } from './sales-entry-modal.component';

describe('SalesEntryModalComponent', () => {
  let component: SalesEntryModalComponent;
  let fixture: ComponentFixture<SalesEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesEntryModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
