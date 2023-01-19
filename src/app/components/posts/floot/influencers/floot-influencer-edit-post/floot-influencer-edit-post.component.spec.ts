import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootInfluencerEditPostComponent } from './floot-influencer-edit-post.component';

describe('FlootInfluencerEditPostComponent', () => {
  let component: FlootInfluencerEditPostComponent;
  let fixture: ComponentFixture<FlootInfluencerEditPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootInfluencerEditPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlootInfluencerEditPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
