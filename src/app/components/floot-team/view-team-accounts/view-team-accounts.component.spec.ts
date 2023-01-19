import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTeamAccountsComponent } from './view-team-accounts.component';

describe('ViewTeamAccountsComponent', () => {
  let component: ViewTeamAccountsComponent;
  let fixture: ComponentFixture<ViewTeamAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewTeamAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewTeamAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
