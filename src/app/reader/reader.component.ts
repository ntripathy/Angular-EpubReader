import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import Epub from "epubjs";
import Book from "epubjs/types/book";
import Rendition from "epubjs/types/rendition";
import defer from "epubjs/lib/utils/core";
import {NavItem} from "epubjs/types/navigation";


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
  chapters:NavItem[];

  constructor(private router : Router) {
  }

  ngOnInit() {
    this.book = Epub("https://s3.amazonaws.com/moby-dick/");
   // this.book = Epub("http://localhost:8081/reader/moby-dick/", {requestMethod: this.overrideRequest.bind(this)});
    this.book.loaded.metadata.then(meta => {
      this.title = meta.title;
    });
    this.storeChapters();
    this.rendition = this.book.renderTo("viewer", { flow: "auto", width: "100%", height: "100%" });
    this.rendition.display("chapter_001.xhtml");
    this.theRequestCallback = this.overrideRequest.bind(this);
  }

  showNext() {
      this.rendition.next()
  }
  showPrev() {
    this.rendition.prev()
  }
  getTitle() {
    return this.title;
  }

  private storeChapters() {
    this.book.loaded.navigation.then(navigation => {
      this.chapters = navigation.toc;
      /*navigation.forEach(x => {
       console.log(x.href);
       return true;
       });*/
    });
  }

  public overrideRequest(url, type, withCredentials, headers) {
      var supportsURL = window.URL;
      var BLOB_RESPONSE = supportsURL ? "blob" : "arraybuffer";
      const blobResponse = BLOB_RESPONSE;
      var deferred = new defer();
      var xhr = new XMLHttpRequest();
      var uri;
      var href;

      //-- Check from PDF.js:
      //   https://github.com/mozilla/pdf.js/blob/master/web/compatibility.js
      var xhrPrototype = XMLHttpRequest.prototype;
      //-- Parse the different parts of a url, returning a object
      function EPUBJScoreuri(url){
        var uri = {
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
          },
          blob = url.indexOf('blob:'),
          doubleSlash = url.indexOf('://'),
          search = url.indexOf('?'),
          fragment = url.indexOf("#"),
          withoutProtocol,
          dot,
          firstSlash;

        if(blob === 0) {
          uri.protocol = "blob";
          uri.base = url.indexOf(0, fragment);
          return uri;
        }

        if(fragment != -1) {
          uri.fragment = url.slice(fragment + 1);
          url = url.slice(0, fragment);
        }

        if(search != -1) {
          uri.search = url.slice(search + 1);
          url = url.slice(0, search);
          href = uri.href;
        }

        if(doubleSlash != -1) {
          uri.protocol = url.slice(0, doubleSlash);
          withoutProtocol = url.slice(doubleSlash+3);
          firstSlash = withoutProtocol.indexOf('/');

          if(firstSlash === -1) {
            uri.host = uri.path;
            uri.path = "";
          } else {
            uri.host = withoutProtocol.slice(0, firstSlash);
            uri.path = withoutProtocol.slice(firstSlash);
          }


          uri.origin = uri.protocol + "://" + uri.host;

          uri.directory = EPUBJScorefolder(uri.path);

          uri.base = uri.origin + uri.directory;
          // return origin;
        } else {
          uri.path = url;
          uri.directory = EPUBJScorefolder(url);
          uri.base = uri.directory;
        }

        //-- Filename
        uri.filename = url.replace(uri.base, '');
        dot = uri.filename.lastIndexOf('.');
        if(dot != -1) {
          uri.extension = uri.filename.slice(dot+1);
        }
        return uri;
      };

      var EPUBJScorefolder = function(url){

        var lastSlash = url.lastIndexOf('/');

        if(lastSlash == -1) var folder = '';

        folder = url.slice(0, lastSlash + 1);

        return folder;

      };


      var handler = function () {
        var r;

        if (this.readyState != this.DONE) return;

        if ((this.status === 200 || this.status === 0) && this.response) { // Android & Firefox reporting 0 for local & blob urls
          if (type == 'xml') {
            // If this.responseXML wasn't set, try to parse using a DOMParser from text
            if (!this.responseXML) {
              r = new DOMParser().parseFromString(this.response, "application/xml");
            } else {
              r = this.responseXML;
            }
          } else if (type == 'xhtml') {
            var text = atob(this.responseXML.body.innerHTML);
            this.responseXML.body.innerHTML = text;
            if (!this.responseXML) {
              r = new DOMParser().parseFromString(text, "application/xhtml+xml");
            } else {
              r = this.responseXML;
            }
          } else if (type == 'html') {
            if (!this.responseXML) {
              r = new DOMParser().parseFromString(this.response, "text/html");
            } else {
              r = this.responseXML;
            }
          } else if (type == 'json') {
            r = JSON.parse(this.response);
          } else if (type == 'blob') {
            if (supportsURL) {
              r = this.response;
            } else {
              //-- Safari doesn't support responseType blob, so create a blob from arraybuffer
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
      xhr.open("GET", url, true);

      if (withCredentials) {
        xhr.withCredentials = true;
      }

      // If type isn't set, determine it from the file extension
      if (!type) {
        uri = EPUBJScoreuri(url);
        type = 'xhtml';//uri.extension;
        type = {
            'htm': 'html'
          }[type] || type;
      }

      if (type == 'blob') {
        xhr.responseType = BLOB_RESPONSE as XMLHttpRequestResponseType;
      }

      if (type == "json") {
        xhr.setRequestHeader("Accept", "application/json");
      }

      if (type == 'xml') {
        xhr.responseType = "document";
        xhr.overrideMimeType('text/xml'); // for OPF parsing
      }

      if (type == 'xhtml') {
        xhr.responseType = "document";
      }

      if (type == 'html') {
        xhr.responseType = "document";
      }

      if (type == "binary") {
        xhr.responseType = "arraybuffer";
      }

      xhr.send();

      return deferred.promise;
    }

}
