import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuePostsTableComponent } from './venue-posts-table.component';

describe('VenuePostsTableComponent', () => {
  let component: VenuePostsTableComponent;
  let fixture: ComponentFixture<VenuePostsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenuePostsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenuePostsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
