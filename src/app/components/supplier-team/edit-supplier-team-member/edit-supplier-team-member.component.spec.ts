import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSupplierTeamMemberComponent } from './edit-supplier-team-member.component';

describe('EditSupplierTeamMemberComponent', () => {
  let component: EditSupplierTeamMemberComponent;
  let fixture: ComponentFixture<EditSupplierTeamMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSupplierTeamMemberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSupplierTeamMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
