import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HomeComponent} from './home/home.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HomeComponent
      ],
    }).compileComponents();
  }));
<<<<<<< Updated upstream
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'BookStore'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('BookStore');
  }));
=======
  
  
>>>>>>> Stashed changes
  
});
