import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashTileComponent } from './dash-tile.component';

describe('DashTileComponent', () => {
  let component: DashTileComponent;
  let fixture: ComponentFixture<DashTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashTileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
