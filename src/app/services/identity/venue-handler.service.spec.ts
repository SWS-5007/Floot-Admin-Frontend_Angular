import { TestBed } from '@angular/core/testing';

import { VenueHandlerService } from './venue-handler.service';

describe('VenueHandlerService', () => {
  let service: VenueHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenueHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
