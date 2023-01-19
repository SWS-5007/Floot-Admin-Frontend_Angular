import { TestBed } from '@angular/core/testing';

import { PendingSaveService } from './pending-save.service';

describe('PendingSaveService', () => {
  let service: PendingSaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingSaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
