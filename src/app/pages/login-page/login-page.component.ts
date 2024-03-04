import { NgClass } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { Router, RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { UserService } from '../../services/user.service';
import { catchError, take, throwError } from 'rxjs';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink, 
    RouterLinkWithHref, 
    RouterOutlet,
    HttpClientModule,
    NgClass
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  email:string = '';
  password: string = '';

  alert: string = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;

  CloseAlert() {
    this.hasError = false;
    this.hasSuccess = false;
  }
  
  LoginUser() {
    const login = {
      Email: this.email,
      Password: this.password
    }
    this.userService.LoginUser(login)
    .pipe(
      take(1),
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe (
      response => {
        this.userService.GetUser(response.data)
        .pipe(
          take(1),
          catchError(error => {
            console.error('Server error:', error.status, error.error);
            return throwError(error);
          }),
        ).subscribe (
          res => {
            this.userService.SetCurrentUser({
              name: res.data.name,
              lastname: res.data.lastname,
              email: res.data.email,
              token: response.data,
            });
            this.router.navigate(['task']);
          });
      },
      error => {
        console.log('Server errorr:', error.status, error.error);
        this.alert = `Erro: ${error.error}`;
        this.hasError = true;
        this.hasSuccess = false; 
      }
    )
  }
}
