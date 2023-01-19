import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkContainerComponent } from './external-link-container.component';

describe('ExternalLinkContainerComponent', () => {
  let component: ExternalLinkContainerComponent;
  let fixture: ComponentFixture<ExternalLinkContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalLinkContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalLinkContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
