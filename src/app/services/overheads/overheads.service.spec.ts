import { TestBed } from '@angular/core/testing';

import { OverheadsService } from './overheads.service';

describe('OverheadsService', () => {
  let service: OverheadsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OverheadsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
