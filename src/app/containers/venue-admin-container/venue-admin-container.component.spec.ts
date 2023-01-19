import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenueAdminContainerComponent } from './venue-admin-container.component';

describe('VenueAdminContainerComponent', () => {
  let component: VenueAdminContainerComponent;
  let fixture: ComponentFixture<VenueAdminContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenueAdminContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VenueAdminContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
