import { Injectable } from '@angular/core';
import { EpubJsRequestUtil } from './reader/EpubJsRequestUtil';
import Epub from 'epubjs';

const baseAPI = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})

export class EbooksEpubService {
  private requestUtil: EpubJsRequestUtil = new EpubJsRequestUtil();

  constructor() { }

  public getBook(bookId: string) {
    return Epub('http://localhost:8080/epubreader/' + bookId + '/', {
      requestMethod: this.requestUtil.request.bind(this),
      requestHeaders: { 'x-ebc-epub-enc': 'true' }
    });
  }

}
