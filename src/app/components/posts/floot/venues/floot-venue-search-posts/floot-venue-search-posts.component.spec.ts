import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootVenueSearchPostsComponent } from './floot-venue-search-posts.component';

describe('FlootVenueSearchPostsComponent', () => {
  let component: FlootVenueSearchPostsComponent;
  let fixture: ComponentFixture<FlootVenueSearchPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootVenueSearchPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlootVenueSearchPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
