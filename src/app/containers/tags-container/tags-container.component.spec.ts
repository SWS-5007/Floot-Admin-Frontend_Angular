import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsContainerComponent } from './tags-container.component';

describe('TagsContainerComponent', () => {
  let component: TagsContainerComponent;
  let fixture: ComponentFixture<TagsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TagsContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
