import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenuePostsComponent } from './venue-posts.component';

describe('VenuePostsComponent', () => {
  let component: VenuePostsComponent;
  let fixture: ComponentFixture<VenuePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenuePostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenuePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
