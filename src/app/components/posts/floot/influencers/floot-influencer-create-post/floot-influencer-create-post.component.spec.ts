import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootInfluencerCreatePostComponent } from './floot-influencer-create-post.component';

describe('FlootInfluencerCreatePostComponent', () => {
  let component: FlootInfluencerCreatePostComponent;
  let fixture: ComponentFixture<FlootInfluencerCreatePostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootInfluencerCreatePostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlootInfluencerCreatePostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
