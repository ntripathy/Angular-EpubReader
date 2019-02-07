import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  books = [{
    id: '1A2B3C4D',
    title: 'Moby Dick'
  }, {
    id: '5E6F7G8H',
    title: 'A Tale of Two Cities'
  }];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  onTitleSelect(event) {
    this.router.navigate(['/reader/' + event.target.value]);
  }

}
