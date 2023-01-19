import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningTimesContainerComponent } from './opening-times-container.component';

describe('OpeningTimesContainerComponent', () => {
  let component: OpeningTimesContainerComponent;
  let fixture: ComponentFixture<OpeningTimesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpeningTimesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpeningTimesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
