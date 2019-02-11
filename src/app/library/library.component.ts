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
    title: 'Enzymes of Energy Technology'
  }, {
    id: 9780226008240,
    title: 'When Peace Is Not Enough: How the Israeli Peace Camp Thinks about Religion, Nationalism, and Justice'
  }, {
    id: 9780739603468,
    title: 'Let\'s Talk About Feeling Inferior'
  }, {
    id: 9781406684520,
    title: 'Talk Japanese'
  }, {
    id: 9780739603550,
    title: 'Let’s Talk About Saying No'
  }, {
    id: 9781135532291,
    title: 'Piping and Pipeline Engineering'
  }, {
    id: 'mahabharata',
    title: 'महाभारत'
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
