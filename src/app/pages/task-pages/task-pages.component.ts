import { Component, OnInit, inject } from '@angular/core';
import { TaskNavbarComponent } from './components/task-navbar/task-navbar.component';
import { TaskSidebarComponent } from './components/task-sidebar/task-sidebar.component';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TaskTasksComponent } from './components/task-tasks/task-tasks.component';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../services/user.service';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Tasks } from '../../models/task'; 
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from './components/services/modal.service';

@Component({
  selector: 'app-task-pages',
  standalone: true,
  imports: [
    TaskNavbarComponent,
    TaskSidebarComponent,
    TaskTasksComponent,
    NgFor,
    NgClass,
    FormsModule,
    NgIf
  ],
  templateUrl: './task-pages.component.html',
  styleUrl: './task-pages.component.scss'
})
export default class TaskPagesComponent implements OnInit {
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private modalService = inject(ModalService);
  private userInfo = this.userService.GetUserInfoSignal();

  modalClass = false;
  isOpen = false;
  counter:number = 0;
  title: string = '';
  description:string = ''

  isChecked: boolean = false;
  token:string = this.userInfo()!.token;
  
  tasks: Tasks[] = [];

  constructor(private route:ActivatedRoute) {}

  ngOnInit(): void {
    this.modalService.isOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        this.OpenModal();
      }
    });
    this.taskService.isAtualize$.subscribe(isAtualize => {
      this.FetchTasks();
    })
  }

  FetchTasks(){
    let taskServiceMethod: (token: string) => Observable<any> = () => of({}); 
  
    this.route.queryParamMap.subscribe(params => {
      const check = params.get('check');
        
      if (check === null) {
        taskServiceMethod = this.taskService.GetTask.bind(this.taskService);
      } else if (check === 'true') {
        taskServiceMethod = this.taskService.GetTaskOnlyTrue.bind(this.taskService);
      } else if (check === 'false') {
        taskServiceMethod = this.taskService.GetTaskOnlyFalse.bind(this.taskService);
      }
  
      taskServiceMethod(this.token)
      .pipe(
        catchError((error) => {
          console.error('Server error:', error.status, error.error);
          return throwError(error);
        }),
      ).subscribe(
        (response: any) => {
          const tasksFromApi = response && response.data ? response.data : null;
          if (tasksFromApi == null) {
            console.log("Não há nenhuma tarefa ainda.");
            return;
          }
          
          this.tasks = tasksFromApi.map((task: Tasks) => {
            return {
              taskId: task.taskId,
              taskTitle: task.taskTitle,
              taskDescription: task.taskDescription,
              taskDate: new Date(task.taskDate),
              taskCompleted: task.taskCompleted
            };
          });
        }
      )
    });
  }

  PostTasks() {
    const post = {
      TaskTitle: this.title,
      TaskDescription: this.description, 
      TaskCompleted: this.isChecked
    }

    this.taskService.PostTasks(post, this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      response => {
        this.FetchTasks();
        this.CloseModal();
      }
    );
  }

  OpenModal() { this.modalClass = true;}
  CloseModal() {  this.modalClass = false;}

  OnModalClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.modal-content')) {
      this.CloseModal(); 
    }
  }

  Caracteres(event: any) {  this.counter = event.target.value.length;}
  
  Checkbox() {
    this.isChecked = !this.isChecked;
  }
  
}
