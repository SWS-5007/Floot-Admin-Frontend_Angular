import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSupportTicketsComponent } from './search-support-tickets.component';

describe('SearchSupportTicketsComponent', () => {
  let component: SearchSupportTicketsComponent;
  let fixture: ComponentFixture<SearchSupportTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSupportTicketsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSupportTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
