import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecSheetComponent } from './spec-sheet.component';

describe('SpecSheetComponent', () => {
  let component: SpecSheetComponent;
  let fixture: ComponentFixture<SpecSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpecSheetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
