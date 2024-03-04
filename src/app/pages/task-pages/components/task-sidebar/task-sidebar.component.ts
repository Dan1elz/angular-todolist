import { Component, inject } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkWithHref, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../../../services/user.service';
import { TaskService } from '../../../../services/task.service';

@Component({
  selector: 'app-task-sidebar',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink, 
    RouterLinkWithHref, 
    RouterOutlet,
    HttpClientModule,
    NgClass
  ],
  templateUrl: './task-sidebar.component.html',
  styleUrl: './task-sidebar.component.scss'
})
export class TaskSidebarComponent {
  private userService = inject(UserService);
  private taskService = inject(TaskService);
  private router = inject(Router);
  protected subscription!: Subscription;
  protected toggleclass = false;
  classeDaDiv = "closed";

  constructor(private sharedService: SharedService) {}
    

  ngOnInit() {
    this.subscription = this.sharedService.buttonClicked$.subscribe(() => {
        if (this.toggleclass == false) {
            this.classeDaDiv = 'open'; 
            this.toggleclass = true;
        } else {
            this.classeDaDiv = 'closed';
            this.toggleclass = false;
        }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  Logout() {
    this.userService.Logout();
    this.router.navigate(['']);
  }
  Null() {
    this.router.navigate(['/task'], { queryParams: { check: null } });
    this.taskService.TickAtualizeTrue();  
  }
  True() {
    this.router.navigate(['/task'], { queryParams: { check: true } });
    this.taskService.TickAtualizeTrue();  
  }
  False() {
    this.router.navigate(['/task'], { queryParams: { check: false } });
    this.taskService.TickAtualizeTrue();  
  }
}
