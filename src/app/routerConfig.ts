import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LibraryComponent } from './library/library.component';
import { ReaderComponent } from './reader/reader.component';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'library',
    pathMatch: 'full'
  }, {
    path: 'library',
    component: LibraryComponent
  }, {
    path: 'reader/:id',
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
export class RouterConfig { }
