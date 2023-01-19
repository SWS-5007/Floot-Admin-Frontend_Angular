import { TestBed } from '@angular/core/testing';

import { DailyRankingService } from './daily-ranking.service';

describe('DailyRankingService', () => {
  let service: DailyRankingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyRankingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
