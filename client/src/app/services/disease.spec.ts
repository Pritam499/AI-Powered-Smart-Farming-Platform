import { TestBed } from '@angular/core/testing';

import { Disease } from './disease.service';

describe('Disease', () => {
  let service: Disease;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Disease);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
