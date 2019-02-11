import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { EbooksEpubService } from './ebooks-epub.service';

describe('EbooksEpubService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: EbooksEpubService = TestBed.get(EbooksEpubService);
    expect(service).toBeTruthy();
  });
});
