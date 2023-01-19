import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlootInfluencerSearchPostsComponent } from './floot-influencer-search-posts.component';

describe('FlootInfluencerSearchPostsComponent', () => {
  let component: FlootInfluencerSearchPostsComponent;
  let fixture: ComponentFixture<FlootInfluencerSearchPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlootInfluencerSearchPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlootInfluencerSearchPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
