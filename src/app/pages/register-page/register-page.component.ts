import { NgClass } from '@angular/common';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, take, throwError } from 'rxjs';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    RouterLink, 
    RouterLinkWithHref, 
    RouterOutlet,
    HttpClientModule
  ],
  templateUrl: './register-page.component.html',
  styleUrl: './register-page.component.scss'
})
export class RegisterPageComponent {
  private userService = inject(UserService);

  alert: string = '';
  name: string = '';
  lastname: string = '';
  email:string = '';
  password: string = '';
  password2: string = '';

  hasError: boolean = false;
  hasSuccess: boolean = false;

  arePasswordsDifferent: boolean = false;

  CloseAlert() {
    this.hasError = false;
    this.hasSuccess = false;
  }
  
  RegisterUser() {
    if( this.password !== this.password2) {
      this.arePasswordsDifferent = true;
    } else {
      this.arePasswordsDifferent = false;
    
      const register = {
        Name: this.name,
        Lastname: this.lastname,
        Email: this.email,
        Password: this.password
      }

      this.userService.RegisterUser(register)
      .pipe(
        take(1),
        catchError((error) => {
          console.error('Server error:', error.status, error.error);
          return throwError(error);
        }),
      ).subscribe(
        response => {
          console.log('Server response:', response);
          this.alert = `${response}`;
          this.hasSuccess = true;
          this.hasError = false; 
        },
        error => {
          console.log('Server errorr:', error.status, error.error);
          this.alert = `Erro: ${error.error}`;
          this.hasError = true;
          this.hasSuccess = false; 
        }
      );
    }
  }
  
}