import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMenuModalComponent } from './add-menu-modal.component';

describe('AddMenuModalComponent', () => {
  let component: AddMenuModalComponent;
  let fixture: ComponentFixture<AddMenuModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMenuModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
