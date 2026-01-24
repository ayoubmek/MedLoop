import { TestBed } from '@angular/core/testing';

import { ServicesList } from './services-list';

describe('ServicesList', () => {
  let service: ServicesList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicesList);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
