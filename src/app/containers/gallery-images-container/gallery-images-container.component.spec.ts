import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryImagesContainerComponent } from './gallery-images-container.component';

describe('GalleryImagesContainerComponent', () => {
  let component: GalleryImagesContainerComponent;
  let fixture: ComponentFixture<GalleryImagesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryImagesContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryImagesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
