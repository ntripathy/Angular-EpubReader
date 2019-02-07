import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Epub from 'epubjs';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import {NavItem} from 'epubjs/types/navigation';
import {EpubJsRequestUtil} from './EpubJsRequestUtil';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})

export class ReaderComponent implements OnInit {
  public theRequestCallback: Function;
  bsModalRef: BsModalRef;
  bookTitle = '';
  chapterTitle = '';
  book: Book;
  rendition: Rendition;
  chapters: NavItem[];
  navOpen: Boolean;
  currentChapter: any;
  requestUtil: EpubJsRequestUtil = new EpubJsRequestUtil();

  constructor(
    private currentRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    console.log('BookID:', this.currentRoute.snapshot.params.id);
    this.book = Epub('https://s3.amazonaws.com/moby-dick/');
   // this.book = Epub('http://localhost:8081/reader/moby-dick/', {requestMethod: this.overrideRequest.bind(this)});
    // this.book = Epub('https://s3.amazonaws.com/moby-dick/');
    const headers = {'x-ebc-epub-enc': 'true'};
    this.book = Epub('http://localhost:8080/epubreader/moby-dick/', {requestMethod: this.requestUtil.request.bind(this), requestHeaders: headers});
    this.book.loaded.metadata.then(meta => {
      this.bookTitle = meta.title;
    });
    this.storeChapters();
    this.rendition = this.book.renderTo('viewer', { flow: 'auto', width: '100%', height: '100%' });
    this.rendition.display();
    this.theRequestCallback = this.requestUtil.request.bind(this);
    this.navOpen = false;
    this.rendition.on('rendered', section => {
      this.currentChapter = this.book.navigation.get(section.href);
      this.chapterTitle = this.currentChapter.label;
    });
    // TODO: Look into reloading chapter with page number
  }

  showNext() {
    this.rendition.next();
  }
  showPrev() {
    this.rendition.prev();
  }

  openModal() {
    const modalConfig = {
      title: 'Time\'s Up',
      modalContent: 'If you wish you continue reading this book, please subscribe.',
      closeBtn: 'Close'
    };
    // this.bsModalRef = this.modalService.show(ModalComponent, {modalConfig});
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
    console.log(this.rendition.currentLocation());
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
