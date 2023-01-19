import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootVenuePostsTableComponent } from './floot-venue-posts-table.component';

describe('FlootVenuePostsTableComponent', () => {
  let component: FlootVenuePostsTableComponent;
  let fixture: ComponentFixture<FlootVenuePostsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootVenuePostsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlootVenuePostsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
