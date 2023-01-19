import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyInfluencerPostsComponent } from './my-influencer-posts.component';

describe('MyInfluencerPostsComponent', () => {
  let component: MyInfluencerPostsComponent;
  let fixture: ComponentFixture<MyInfluencerPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyInfluencerPostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyInfluencerPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
