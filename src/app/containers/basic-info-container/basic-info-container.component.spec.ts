import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicInfoContainerComponent } from './basic-info-container.component';

describe('BasicInfoContainerComponent', () => {
  let component: BasicInfoContainerComponent;
  let fixture: ComponentFixture<BasicInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BasicInfoContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
