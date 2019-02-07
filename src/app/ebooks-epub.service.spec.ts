import { TestBed } from '@angular/core/testing';

import { EbooksEpubService } from './ebooks-epub.service';

describe('EbooksEpubService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EbooksEpubService = TestBed.get(EbooksEpubService);
    expect(service).toBeTruthy();
  });
});
