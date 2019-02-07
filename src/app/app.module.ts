// Core Angular
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

// Plugins
import { ModalModule } from 'ngx-bootstrap/modal';

// App Specific
import { ApiService } from './api.service';
import { EbooksEpubService } from './ebooks-epub.service';

import { AppComponent } from './app.component';
import { LibraryComponent } from './library/library.component';
import { ReaderComponent } from './reader/reader.component';
import { RouterConfig } from './routerConfig';

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    ReaderComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterConfig,
    ModalModule.forRoot()
  ],
  providers: [
      ApiService,
      EbooksEpubService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
