import { TestBed } from '@angular/core/testing';

import { NetificationService } from './netification.service';

describe('NetificationService', () => {
  let service: NetificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
