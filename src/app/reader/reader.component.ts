import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import Epub from 'epubjs';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {NavItem} from 'epubjs/types/navigation';
import {EpubJsRequestUtil} from './EpubJsRequestUtil';


@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})

export class ReaderComponent implements OnInit {
  public theRequestCallback: Function;
  title: string;
  book: Book;
  rendition: Rendition;
  chapters: NavItem[];
  navOpen: Boolean;
  currentChapter: any;
  requestUtil: EpubJsRequestUtil = new EpubJsRequestUtil();

  constructor(private router: Router) {
  }

  ngOnInit() {
    // this.book = Epub('https://s3.amazonaws.com/moby-dick/');
    const headers = {'x-ebc-epub-enc': 'true'};
    this.book = Epub('http://localhost:8080/epubreader/moby-dick/', {requestMethod: this.requestUtil.request.bind(this), requestHeaders: headers});
    // this.book = Epub('http://localhost:8081/reader/moby-dick/', {requestMethod: this.request.bind(this)});
    this.book.loaded.metadata.then(meta => {
      this.title = meta.title;
    });
    this.storeChapters();
    this.rendition = this.book.renderTo('viewer', { flow: 'auto', width: '100%', height: '100%' });
    this.rendition.display('chapter_001.xhtml');
    this.theRequestCallback = this.requestUtil.request.bind(this);
    this.navOpen = false;
  }

  showNext() {
      this.rendition.next();
  }
  showPrev() {
    this.rendition.prev();
  }
  getTitle() {
    if (this.currentChapter) {
      return this.title + (this.currentChapter.label !== this.title ? ' - ' + this.currentChapter.label : '');
    } else {
      return '';
    }
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  displayChapter(chapter: any) {
    this.currentChapter = chapter;
    this.rendition.display(chapter.href);
  }

  private storeChapters() {
    this.book.loaded.navigation.then(navigation => {
      this.chapters = navigation.toc;
      this.currentChapter = this.chapters[4];
    });
  }
}
