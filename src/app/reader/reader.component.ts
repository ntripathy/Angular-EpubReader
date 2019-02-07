import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Epub from 'epubjs';
import Book from 'epubjs/types/book';
import Rendition from 'epubjs/types/rendition';
import defer from 'epubjs/lib/utils/core';
import { NavItem } from 'epubjs/types/navigation';
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

  constructor(
    private currentRoute: ActivatedRoute,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    console.log('BookID:', this.currentRoute.snapshot.params.id);
    this.book = Epub('https://s3.amazonaws.com/moby-dick/');
   // this.book = Epub('http://localhost:8081/reader/moby-dick/', {requestMethod: this.overrideRequest.bind(this)});
    this.book.loaded.metadata.then(meta => {
      this.bookTitle = meta.title;
    });
    this.storeChapters();
    this.rendition = this.book.renderTo('viewer', { flow: 'auto', width: '100%', height: '100%' });
    this.rendition.display('chapter_001.xhtml');
    this.theRequestCallback = this.overrideRequest.bind(this);
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

  public overrideRequest(url, type, withCredentials, headers) {
      const supportsURL = window.URL;
      const BLOB_RESPONSE = supportsURL ? 'blob' : 'arraybuffer';
      const blobResponse = BLOB_RESPONSE;
      const deferred = new defer();
      const xhr = new XMLHttpRequest();
      let uri;
      let href;

      // -- Check from PDF.js:
      //   https://github.com/mozilla/pdf.js/blob/master/web/compatibility.js
      const xhrPrototype = XMLHttpRequest.prototype;
      // -- Parse the different parts of a url, returning a object
      function EPUBJScoreuri(url) {
        const uri = {
            protocol : '',
            host : '',
            path : '',
            origin : '',
            directory : '',
            base : '',
            filename : '',
            extension : '',
            fragment : '',
            href : url,
            search : ''
          };
        const blob = url.indexOf('blob:');
        const doubleSlash = url.indexOf('://');
        const search = url.indexOf('?');
        const fragment = url.indexOf('#');
        let withoutProtocol = '';
        let dot;
        let firstSlash: number;

        if (blob === 0) {
          uri.protocol = 'blob';
          uri.base = url.indexOf(0, fragment);
          return uri;
        }

        if (fragment !== -1) {
          uri.fragment = url.slice(fragment + 1);
          url = url.slice(0, fragment);
        }

        if (search !== -1) {
          uri.search = url.slice(search + 1);
          url = url.slice(0, search);
          href = uri.href;
        }

        if (doubleSlash !== -1) {
          uri.protocol = url.slice(0, doubleSlash);
          withoutProtocol = url.slice(doubleSlash + 3);
          firstSlash = withoutProtocol.indexOf('/');

          if (firstSlash === -1) {
            uri.host = uri.path;
            uri.path = '';
          } else {
            uri.host = withoutProtocol.slice(0, firstSlash);
            uri.path = withoutProtocol.slice(firstSlash);
          }


          uri.origin = uri.protocol + '://' + uri.host;

          uri.directory = EPUBJScorefolder(uri.path);

          uri.base = uri.origin + uri.directory;
          // return origin;
        } else {
          uri.path = url;
          uri.directory = EPUBJScorefolder(url);
          uri.base = uri.directory;
        }

        // Filename
        uri.filename = url.replace(uri.base, '');
        dot = uri.filename.lastIndexOf('.');
        if (dot !== -1) {
          uri.extension = uri.filename.slice(dot + 1);
        }
        return uri;
      }

      function EPUBJScorefolder(url) {
        const lastSlash = url.lastIndexOf('/');
        return lastSlash === -1 ? '' : url.slice(0, lastSlash + 1);
      }


      const handler = function () {
        let r;

        if (this.readyState !== this.DONE) { return; }

        if ((this.status === 200 || this.status === 0) && this.response) { // Android & Firefox reporting 0 for local & blob urls
          if (type === 'xml') {
            // If this.responseXML wasn't set, try to parse using a DOMParser from text
            if (!this.responseXML) {
              r = new DOMParser().parseFromString(this.response, 'application/xml');
            } else {
              r = this.responseXML;
            }
          } else if (type === 'xhtml') {
            const text = atob(this.responseXML.body.innerHTML);
            this.responseXML.body.innerHTML = text;
            if (!this.responseXML) {
              r = new DOMParser().parseFromString(text, 'application/xhtml+xml');
            } else {
              r = this.responseXML;
            }
          } else if (type === 'html') {
            if (!this.responseXML) {
              r = new DOMParser().parseFromString(this.response, 'text/html');
            } else {
              r = this.responseXML;
            }
          } else if (type === 'json') {
            r = JSON.parse(this.response);
          } else if (type === 'blob') {
            if (supportsURL) {
              r = this.response;
            } else {
              // Safari doesn't support responseType blob, so create a blob from arraybuffer
              r = new Blob([this.response]);
            }
          } else {
            r = this.response;
          }

          deferred.resolve(r);
        } else {
          deferred.reject({
            message: this.response,
            stack: new Error().stack
          });
        }
      };

      if (!('overrideMimeType' in xhrPrototype)) {
        // IE10 might have response, but not overrideMimeType
        Object.defineProperty(xhrPrototype, 'overrideMimeType', {
          value: function xmlHttpRequestOverrideMimeType(mimeType) {
          }
        });
      }

      xhr.onreadystatechange = handler;
      xhr.open('GET', url, true);

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      // If type isn't set, determine it from the file extension
      if (!type) {
        uri = EPUBJScoreuri(url);
        type = 'xhtml'; // uri.extension;
        type = {
            'htm': 'html'
          }[type] || type;
      }

      if (type === 'blob') {
        xhr.responseType = BLOB_RESPONSE as XMLHttpRequestResponseType;
      }

      if (type === 'json') {
        xhr.setRequestHeader('Accept', 'application/json');
      }

      if (type === 'xml') {
        xhr.responseType = 'document';
        xhr.overrideMimeType('text/xml'); // for OPF parsing
      }

      if (type === 'xhtml') {
        xhr.responseType = 'document';
      }

      if (type === 'html') {
        xhr.responseType = 'document';
      }

      if (type === 'binary') {
        xhr.responseType = 'arraybuffer';
      }

      xhr.send();

      return deferred.promise;
    }

}
