import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInfluencerPostComponent } from './edit-influencer-post.component';

describe('EditInfluencerPostComponent', () => {
  let component: EditInfluencerPostComponent;
  let fixture: ComponentFixture<EditInfluencerPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditInfluencerPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInfluencerPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
