import { TestBed } from '@angular/core/testing';

import { ProductMarginTrackerService } from './product-margin-tracker.service';

describe('ProductMarginTrackerService', () => {
  let service: ProductMarginTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductMarginTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
