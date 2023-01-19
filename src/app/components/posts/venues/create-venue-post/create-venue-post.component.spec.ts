import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVenuePostComponent } from './create-venue-post.component';

describe('CreateVenuePostComponent', () => {
  let component: CreateVenuePostComponent;
  let fixture: ComponentFixture<CreateVenuePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateVenuePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVenuePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
