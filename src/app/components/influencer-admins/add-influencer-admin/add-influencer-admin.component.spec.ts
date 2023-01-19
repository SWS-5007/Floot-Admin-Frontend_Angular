import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInfluencerAdminComponent } from './add-influencer-admin.component';

describe('AddInfluencerAdminComponent', () => {
  let component: AddInfluencerAdminComponent;
  let fixture: ComponentFixture<AddInfluencerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInfluencerAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInfluencerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
