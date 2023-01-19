import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInfluencerComponent } from './create-influencer.component';

describe('CreateInfluencerComponent', () => {
  let component: CreateInfluencerComponent;
  let fixture: ComponentFixture<CreateInfluencerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateInfluencerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInfluencerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
