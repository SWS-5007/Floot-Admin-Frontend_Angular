import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInfluencerAdminsComponent } from './search-influencer-admins.component';

describe('SearchInfluencerAdminsComponent', () => {
  let component: SearchInfluencerAdminsComponent;
  let fixture: ComponentFixture<SearchInfluencerAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInfluencerAdminsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInfluencerAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
