import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuContainerComponent } from './menu-container.component';

describe('MenuContainerComponent', () => {
  let component: MenuContainerComponent;
  let fixture: ComponentFixture<MenuContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuContainerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
