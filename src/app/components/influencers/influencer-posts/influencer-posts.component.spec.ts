import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerPostsComponent } from './influencer-posts.component';

describe('InfluencerPostsComponent', () => {
  let component: InfluencerPostsComponent;
  let fixture: ComponentFixture<InfluencerPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfluencerPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluencerPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
