import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchNotificationsComponent } from './search-notifications.component';

describe('SearchNotificationsComponent', () => {
  let component: SearchNotificationsComponent;
  let fixture: ComponentFixture<SearchNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
