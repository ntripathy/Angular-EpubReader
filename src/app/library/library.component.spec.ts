import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LibraryComponent } from './library.component';

describe('LibraryComponent', () => {
  let component: LibraryComponent;
  let fixture: ComponentFixture<LibraryComponent>;

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
      imports: [ RouterTestingModule.withRoutes([]) ],
      declarations: [ LibraryComponent ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onTitleSelect(event)', () => {
    it('should navigate', () => {
      const navigateSpy = spyOn((<any>component).router, 'navigate');
      const evt = {
        target : {
          value : mockLibrary[0].id
        }
      };
      component.onTitleSelect(evt);
      console.log(evt);
      expect(navigateSpy).toHaveBeenCalledWith(['/reader/' + mockLibrary[0].id]);
    });
  });
});
