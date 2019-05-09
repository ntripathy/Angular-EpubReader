import { Injectable } from '@angular/core';
import { EpubJsRequestUtil } from './reader/EpubJsRequestUtil';
import Epub from 'epubjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { AnnotationsModel } from './reader/annotations.datamodel';

const baseAPI = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})

export class EbooksEpubService {
  private requestUtil: EpubJsRequestUtil = new EpubJsRequestUtil();

  constructor(
      private http: HttpClient
  ) { }

  public getBook(bookId: string) {
    return Epub('http://localhost:8080/epubreader/' + bookId + '/', {
      requestMethod: this.requestUtil.request.bind(this)
    });
  }

  public getAnnotations(bookId: string) {
    return this.http.get(baseAPI + '/epub/annotations/' + bookId).pipe(map(res => res as AnnotationsModel));
  }

}
