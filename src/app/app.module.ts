import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { LibraryComponent } from './library/library.component';
import { ReaderComponent } from './reader/reader.component';
import { RouterConfig } from './routerConfig';
import { ModalModule } from 'ngx-bootstrap/modal';

const socketConfig: SocketIoConfig = { url: 'http://localhost:8080/timer', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    ReaderComponent
  ],
  imports: [
    BrowserModule,
    RouterConfig,
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
