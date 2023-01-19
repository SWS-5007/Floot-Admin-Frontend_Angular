import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSupportTicketComponent } from './create-support-ticket.component';

describe('CreateSupportTicketComponent', () => {
  let component: CreateSupportTicketComponent;
  let fixture: ComponentFixture<CreateSupportTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateSupportTicketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSupportTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
