import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVenuePostComponent } from './edit-venue-post.component';

describe('EditVenuePostComponent', () => {
  let component: EditVenuePostComponent;
  let fixture: ComponentFixture<EditVenuePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVenuePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVenuePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
