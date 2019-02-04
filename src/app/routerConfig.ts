import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {ReaderComponent} from './reader/reader.component'

export const appRoutes: Routes = [
  { path: 'reader',
    component: ReaderComponent
  }
  ];
@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RouterConfig { };
