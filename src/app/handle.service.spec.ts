import { TestBed } from '@angular/core/testing';

import { dataHandler } from './handle.service';

describe('HandleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: dataHandler = TestBed.get(dataHandler);
    expect(service).toBeTruthy();
  });
});
