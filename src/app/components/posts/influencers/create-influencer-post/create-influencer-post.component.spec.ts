import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfluencerPostComponent } from './create-influencer-post.component';

describe('CreateInfluencerPostComponent', () => {
  let component: CreateInfluencerPostComponent;
  let fixture: ComponentFixture<CreateInfluencerPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInfluencerPostComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfluencerPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
