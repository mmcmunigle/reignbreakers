import { TestBed } from '@angular/core/testing';

import { ReignmakerApiService } from './api.service';

describe('ReignmakerApiService', () => {
  let service: ReignmakerApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReignmakerApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
