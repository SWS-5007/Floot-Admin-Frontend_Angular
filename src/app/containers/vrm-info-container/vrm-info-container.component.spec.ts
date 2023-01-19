import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrmInfoContainerComponent } from './vrm-info-container.component';

describe('VrmInfoContainerComponent', () => {
  let component: VrmInfoContainerComponent;
  let fixture: ComponentFixture<VrmInfoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrmInfoContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VrmInfoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
