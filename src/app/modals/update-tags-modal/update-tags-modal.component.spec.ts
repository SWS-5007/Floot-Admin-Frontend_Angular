import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTagsModalComponent } from './update-tags-modal.component';

describe('UpdateTagsModalComponent', () => {
  let component: UpdateTagsModalComponent;
  let fixture: ComponentFixture<UpdateTagsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateTagsModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTagsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
