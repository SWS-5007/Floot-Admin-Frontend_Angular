import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerProfileComponent } from './influencer-profile.component';

describe('InfluencerProfileComponent', () => {
  let component: InfluencerProfileComponent;
  let fixture: ComponentFixture<InfluencerProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluencerProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
