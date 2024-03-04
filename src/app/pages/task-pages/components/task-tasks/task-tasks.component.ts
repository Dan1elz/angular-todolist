import { CommonModule, NgClass, NgFor } from '@angular/common';
import { Component, HostListener, Input, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../../services/task.service';
import { UserService } from '../../../../services/user.service';
import { catchError, throwError } from 'rxjs';
import { CommentsService } from '../../../../services/comments.service';
import { Comments } from '../../../../models/comments';

@Component({
  selector: 'app-task-tasks',
  standalone: true,
  imports: [FormsModule, NgFor, NgClass, CommonModule],
  templateUrl: './task-tasks.component.html',
  styleUrl: './task-tasks.component.scss'
})
export class TaskTasksComponent implements OnInit {
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private commentsService =  inject(CommentsService);
  private userInfo = this.userService.GetUserInfoSignal();

  @Input() taskId: string = '';
  @Input() taskTitle: string = '';
  @Input() taskDescription: string ='';
  @Input() taskDate: Date = new Date();
  @Input() taskCompleted: boolean = false;

  token:string = this.userInfo()!.token;
  
  isChecked: boolean = false;
  isCheckedEdit: boolean = false;

  isDrop: boolean = false;
  isDropSecond: boolean[] = [];
  openIndex: number | null = null;

  modalClass = false;
  counter:number = 0;
  title: string = '';
  description:string = '';

  counterComment: number = 0;
  modalClassComment = false;
  comment: string = '';

  comments: Comments[] = [];

  ngOnInit(): void {
    this.commentsService.isAtualize$.subscribe(isAtualize =>{
      this.FetchComments();
    });
    
    this.isChecked = this.taskCompleted;
    this.isCheckedEdit = this.taskCompleted;
    this.title = this.taskTitle;
    this.description = this.taskDescription;
  }
  FetchComments() {
    this.commentsService.GetComments(this.taskId, this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe((response: any) => {
      const commentsFromApi = response && response.data ? response.data : null;
      if (commentsFromApi == null) {
        console.log("Não há nenhuma tarefa ainda.");
        return;
      }

      this.comments = commentsFromApi.map((comment: any) => {
        return {
          CommentId: comment.commentId,
          CommentText: comment.commentText,
          CommentDate: new Date(comment.commentDate),
        }
      });
    });
  }

  DeleteTask() {
    this.taskService.DeleteTasks(this.taskId, this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      response => { this.taskService.TickAtualizeTrue();}
    );
  }
 
  EditTask() {
    const edit = {
      TaskId: this.taskId,
      TaskTitle: this.title,
      TaskDescription: this.description, 
      TaskCompleted: this.isCheckedEdit
    }

    this.taskService.EditTasks(edit, this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      response => { this.taskService.TickAtualizeTrue();}
    );
  }

  CommentTask() {
    const comment = {
      CommentText: this.comment,
      CommentTaskId: this.taskId,
    }
    
    this.commentsService.PostComments(comment, this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      response => { this.taskService.TickAtualizeTrue();}
    );
  }

  DeleteComment(id:string) {
    this.commentsService.DeleteComment(id,this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe(
      response => { this.taskService.TickAtualizeTrue();}
    );
  }

  OpenModalEdit() { 
    this.modalClass = true;
    this.isDrop = false;
  }

  OpenModalComment() {
    this.modalClassComment = true;
  }
  
  CloseModal() {  this.modalClass = false;}

  CloseModalComment() {this.modalClassComment = false;}
  
  Caracteres(event: any) {  this.counter = event.target.value.length;}

  CaracteresComment(event: any) {  this.counterComment = event.target.value.length;}
  
  Checkbox(): void {  
    this.isChecked = !this.isChecked;

    const atualize = {
      TaskId : this.taskId,
      TaskCompleted : this.isChecked
    }

    this.taskService.EditCheckbox(atualize,this.token)
    .pipe(
      catchError((error) => {
        console.error('Server error:', error.status, error.error);
        return throwError(error);
      }),
    ).subscribe();
  }

  CheckboxEdit(): void {  this.isCheckedEdit = !this.isCheckedEdit;}
  
  OnModalClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.modal-content')) {
      this.CloseModal(); 
    }
  }
  
  ShowDropdownSecond(index: number): void {
    if (this.openIndex !== null && this.openIndex !== index) {
      this.isDropSecond[this.openIndex] = false;
    }
    this.isDropSecond[index] = !this.isDropSecond[index];
    this.openIndex = index;
  }

  ShowDropdown(): void {  this.isDrop = !this.isDrop;}

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!event || !event.target) {
      return;
    }

    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.header')) {
      this.isDrop = false;
    }
    
    if (this.openIndex !== null && !targetElement.closest('.drop-active')) {
      this.isDropSecond = this.isDropSecond.map(() => false);
      this.openIndex = null;
    }
  }
}