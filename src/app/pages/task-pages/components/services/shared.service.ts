import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private buttonClickedSubject = new Subject<void>();

  buttonClicked$ = this.buttonClickedSubject.asObservable();
  
  buttonClicked() {
    this.buttonClickedSubject.next();
  }

}
