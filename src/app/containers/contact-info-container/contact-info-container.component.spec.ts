import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactInfoContainerComponent } from './contact-info-container.component';

describe('ContactInfoContainerComponent', () => {
  let component: ContactInfoContainerComponent;
  let fixture: ComponentFixture<ContactInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactInfoContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
