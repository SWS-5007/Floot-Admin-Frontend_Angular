import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfluencerAdminComponent } from './edit-influencer-admin.component';

describe('EditInfluencerAdminComponent', () => {
  let component: EditInfluencerAdminComponent;
  let fixture: ComponentFixture<EditInfluencerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInfluencerAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInfluencerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
