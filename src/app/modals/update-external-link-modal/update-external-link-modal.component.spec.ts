import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateExternalLinkModalComponent } from './update-external-link-modal.component';

describe('UpdateExternalLinkModalComponent', () => {
  let component: UpdateExternalLinkModalComponent;
  let fixture: ComponentFixture<UpdateExternalLinkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateExternalLinkModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateExternalLinkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
