import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupplierTeamMemberComponent } from './add-supplier-team-member.component';

describe('AddSupplierTeamMemberComponent', () => {
  let component: AddSupplierTeamMemberComponent;
  let fixture: ComponentFixture<AddSupplierTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSupplierTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSupplierTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
