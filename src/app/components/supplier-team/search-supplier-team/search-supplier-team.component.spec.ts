import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSupplierTeamComponent } from './search-supplier-team.component';

describe('SearchSupplierTeamComponent', () => {
  let component: SearchSupplierTeamComponent;
  let fixture: ComponentFixture<SearchSupplierTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchSupplierTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSupplierTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
