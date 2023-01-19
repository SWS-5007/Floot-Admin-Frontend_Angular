import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVenuePostsComponent } from './my-venue-posts.component';

describe('MyVenuePostsComponent', () => {
  let component: MyVenuePostsComponent;
  let fixture: ComponentFixture<MyVenuePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyVenuePostsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVenuePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
