import { Component, OnInit, inject } from '@angular/core';
import { TaskNavbarComponent } from '../task-pages/components/task-navbar/task-navbar.component';
import { TaskSidebarComponent } from '../task-pages/components/task-sidebar/task-sidebar.component';
import { NgClass, NgFor } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { catchError, switchMap, take, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-perfil-page',
  standalone: true,
  imports: [
    TaskNavbarComponent, 
    TaskSidebarComponent,
    NgFor,
    NgClass,
    FormsModule
  ],
  templateUrl: './perfil-page.component.html',
  styleUrl: './perfil-page.component.scss'
})
export default class PerfilPageComponent implements OnInit {
  private userService = inject(UserService);
  private tasksService = inject(TaskService);
  private router = inject(Router);
  protected userInfo = this.userService.GetUserInfoSignal();

  token = this.userInfo()!.token;

  name: string = this.userInfo()!.name;
  lastname: string = this.userInfo()!.lastname;
  email:string = this.userInfo()!.email;
  password: string = '';
  password2: string = '';

  
  alert: string = '';
  hasError: boolean = false;
  hasSuccess: boolean = false;

  arePasswordsDifferent: boolean = false;

  quantTaskCompleted:number = 0;
  quantTask: number = 0;

  modalClass = false;
  modalClass2 = false;

  ngOnInit(): void {
    this.GetCompleted();
    this.GetTasks();
  }
  CloseModal() {  this.modalClass = false;}
  CloseModalSecond() {  this.modalClass2 = false;}
  OpenModal() { this.modalClass = true;}
  OpenModalSecond() { this.modalClass2 = true;}

  CloseAlert() {
    this.hasError = false;
    this.hasSuccess = false;
  }
  OnModalClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.modal-content')) {
      this.CloseModal(); 
    }
  }
  DeleteUser() {
    this.userService.DeleteUser(this.token)
    .pipe(
      take(1),
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      response => {
        this.userService.Logout();
        this.router.navigate(['']);
      }
    )
  }
  EditUser() {
    if(this.password !== this.password2) {
      this.arePasswordsDifferent = true;
      return;
    } else {
      this.arePasswordsDifferent = false;
    }

    const update = {
      Name: this.name,
      Lastname: this.lastname,
      Email: this.email,
      Password: this.password
    }

    this.userService.UpdateUser(update, this.token)
    .pipe(
      take(1),
      switchMap((response) => {
        this.token = response.data
        return this.userService.GetUser(response.data)
        .pipe(
          catchError((error) => {
            console.error('Server error:', error.status, error.error);
            return throwError(error);
          })
        );
      }),
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      })
    )
    .subscribe(
      res => {
        this.userService.SetCurrentUser({
          name: res.data.name,
          lastname: res.data.lastname,
          email: res.data.email,
          token: this.token,
        });

        this.CloseModalSecond();
        this.alert = `Usuario atualizado com sucesso!`;
        this.hasSuccess = true;
        this.hasError = false; 
      }, error => {
        this.CloseModalSecond();
        this.alert = `Erro: ${error.error}`;
        this.hasError = true;
        this.hasSuccess = false; 
      }
    );
  }
  GetCompleted() {
    this.tasksService.GetTaskOnlyTrue(this.token)
    .pipe(
      take(1),
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      (response: any) => {
        this.quantTaskCompleted = response.data.length;
      }
    );
  }
  GetTasks() {
    this.tasksService.GetTask(this.token)
    .pipe(
      take(1),
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      (response: any) => {
        this.quantTask = response.data.length;
      }
    );
  }
}