import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootVenueEditPostComponent } from './floot-venue-edit-post.component';

describe('FlootVenueEditPostComponent', () => {
  let component: FlootVenueEditPostComponent;
  let fixture: ComponentFixture<FlootVenueEditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootVenueEditPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlootVenueEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
