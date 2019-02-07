// Core Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Plugins
import { ModalModule } from 'ngx-bootstrap/modal';

// App Specific
import { AppComponent } from './app.component';
import { LibraryComponent } from './library/library.component';
import { ReaderComponent } from './reader/reader.component';
import { RouterConfig } from './routerConfig';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LibraryComponent,
    ReaderComponent,
    ModalComponent
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
