import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVenueAdminComponent } from './add-venue-admin.component';

describe('AddVenueAdminComponent', () => {
  let component: AddVenueAdminComponent;
  let fixture: ComponentFixture<AddVenueAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVenueAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddVenueAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
