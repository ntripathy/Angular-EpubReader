import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { ModalModule } from 'ngx-bootstrap';

import { ReaderComponent } from './reader.component';

describe('ReaderComponent', () => {
  let component: ReaderComponent;
  let fixture: ComponentFixture<ReaderComponent>;

  const mockLibrary = [{
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderComponent ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            params: { id: 9780128163627 }
          }
        }
      }],
      imports: [
        HttpClientModule,
        ModalModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
