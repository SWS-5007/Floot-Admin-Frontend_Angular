import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverheadsComponent } from './overheads.component';

describe('OverheadsComponent', () => {
  let component: OverheadsComponent;
  let fixture: ComponentFixture<OverheadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverheadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OverheadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
