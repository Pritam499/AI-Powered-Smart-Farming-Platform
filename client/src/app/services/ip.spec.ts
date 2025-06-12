import { TestBed } from '@angular/core/testing';

import { Ip } from './ip.service';

describe('Ip', () => {
  let service: Ip;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ip);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
