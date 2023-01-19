import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfluencerComponent } from './edit-influencer.component';

describe('EditInfluencerComponent', () => {
  let component: EditInfluencerComponent;
  let fixture: ComponentFixture<EditInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInfluencerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
