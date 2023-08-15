import { TestBed } from '@angular/core/testing';

import { TensionflammeService } from './tensionflamme.service';

describe('TensionflammeService', () => {
  let service: TensionflammeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TensionflammeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
