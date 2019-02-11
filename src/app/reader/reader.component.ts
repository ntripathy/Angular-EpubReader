import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';

import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import { NavItem } from 'epubjs/types/navigation';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from '../api.service';
import { EbooksEpubService } from '../ebooks-epub.service';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.css']
})

export class ReaderComponent implements OnInit {
  @ViewChild('expiredModal') expiredModal: TemplateRef<any>;
  @ViewChild('blockedModal') blockedModal: TemplateRef<any>;
  modalRef: BsModalRef;
  bookTitle = '';
  chapterTitle = '';
  book: Book;
  rendition: Rendition;
  chapters: NavItem[];
  navOpen: Boolean;
  currentChapter: any;
  sessionId: string;
  pollInterval: any;

  constructor(
    private currentRoute: ActivatedRoute,
    private api: ApiService,
    private epubService: EbooksEpubService,
    private modalService: BsModalService,
    private router: Router
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        clearInterval(this.pollInterval);
      }
    });
  }

  ngOnInit() {
    console.log('BookID:', this.currentRoute.snapshot.params.id);
    this.book = this.epubService.getBook(this.currentRoute.snapshot.params.id);
    this.book.loaded.metadata.then(meta => {
      this.bookTitle = meta.title;
    });
    // this.epubService.getAnnotations(this.currentRoute.snapshot.params.id);
    this.storeChapters();
    this.rendition = this.book.renderTo('viewer', { flow: 'auto', width: '100%', height: '100%' });
    this.rendition.display();
    this.navOpen = false;
    this.rendition.on('rendered', section => {
      this.currentChapter = this.book.navigation.get(section.href);
      this.chapterTitle = this.currentChapter ? this.currentChapter.label : '';
    });

    this.epubService.getAnnotations(this.currentRoute.snapshot.params.id).subscribe( response => {
      const cfis = response.epubCfis;
      for(let cfi of cfis) {
        this.rendition.annotations.add('highlight', cfi, {data: 'Testing'}, (e) => {console.log("highlight clicked", e.target);} , "hl", {"fill": "red", "fill-opacity": "0.3", "mix-blend-mode": "multiply"});
      }
    });

    // TODO: Look into reloading chapter with page number

    this.getSessionId();
  }

  getSessionId() {
    this.api.getSessionID().subscribe(response => {
      this.sessionId = response.sessionId;
      this.setPolling();
    });
  }

  setPolling() {
    this.pollInterval = setInterval(() => {
      this.checkForExpiration();
    }, 5000);
  }

  checkForExpiration() {
    this.api.validateSession(this.sessionId).subscribe(response => {
      // No Response Needed
    }, error => {
      clearInterval(this.pollInterval);
      if (error.status === 410) {
        this.modalRef = this.modalService.show(this.expiredModal, {
          ignoreBackdropClick: true,
          class: 'modal-lg ebooks-modal',
          keyboard: false
        });
      } else {
        this.modalRef = this.modalService.show(this.blockedModal, {
          ignoreBackdropClick: true,
          class: 'modal-lg ebooks-modal',
          keyboard: false
        });
      }
    });
  }

  showNext() {
    this.rendition.next();
  }
  showPrev() {
    this.rendition.prev();
  }

  toggleNav() {
    this.navOpen = !this.navOpen;
  }

  onSubscribeClick() {
    this.modalService.hide(1);
    this.router.navigate(['/library']);
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
