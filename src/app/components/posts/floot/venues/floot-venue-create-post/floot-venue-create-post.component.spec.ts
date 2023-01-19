import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootVenueCreatePostComponent } from './floot-venue-create-post.component';

describe('FlootVenueCreatePostComponent', () => {
  let component: FlootVenueCreatePostComponent;
  let fixture: ComponentFixture<FlootVenueCreatePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootVenueCreatePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlootVenueCreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
