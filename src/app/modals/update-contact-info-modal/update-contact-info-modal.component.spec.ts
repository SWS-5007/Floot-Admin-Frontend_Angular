import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateContactInfoModalComponent } from './update-contact-info-modal.component';

describe('UpdateContactInfoModalComponent', () => {
  let component: UpdateContactInfoModalComponent;
  let fixture: ComponentFixture<UpdateContactInfoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateContactInfoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateContactInfoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
