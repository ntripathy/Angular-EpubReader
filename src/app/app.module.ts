import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ReaderComponent } from './reader/reader.component';

import {RouterConfig} from  './routerConfig';

@NgModule({
  declarations: [
    AppComponent,
    ReaderComponent
  ],
  imports: [
    BrowserModule,
    RouterConfig
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
