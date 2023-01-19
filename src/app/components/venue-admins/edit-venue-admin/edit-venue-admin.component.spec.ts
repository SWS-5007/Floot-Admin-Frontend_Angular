import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVenueAdminComponent } from './edit-venue-admin.component';

describe('EditVenueAdminComponent', () => {
  let component: EditVenueAdminComponent;
  let fixture: ComponentFixture<EditVenueAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditVenueAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVenueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
