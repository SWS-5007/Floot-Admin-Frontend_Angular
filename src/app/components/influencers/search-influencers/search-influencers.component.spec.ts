import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchInfluencersComponent } from './search-influencers.component';

describe('SearchVenuesComponent', () => {
  let component: SearchInfluencersComponent;
  let fixture: ComponentFixture<SearchInfluencersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchInfluencersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchInfluencersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
