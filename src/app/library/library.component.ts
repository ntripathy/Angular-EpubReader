import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  books = [{
    id: 9780128163627,
    title: '9780128163627'
  }, {
    id: 9780226008240,
    title: '9780226008240'
  }, {
    id: 9780739603468,
    title: 'Let\'s Talk About Feeling Inferior'
  }, {
    id: 9781406684520,
    title: 'Talk Japanese'
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
