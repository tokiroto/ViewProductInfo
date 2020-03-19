import { TestBed } from '@angular/core/testing';

import { LocalstorageService } from './localstorage.service';

describe('LocalstorageService', () => {
  let service: LocalstorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(LocalstorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
