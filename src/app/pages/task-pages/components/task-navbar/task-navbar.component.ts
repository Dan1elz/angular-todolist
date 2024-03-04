import { Component, inject } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'app-task-navbar',
  standalone: true,
  imports: [NgClass, FormsModule],
  templateUrl: './task-navbar.component.html',
  styleUrl: './task-navbar.component.scss'
})
export class TaskNavbarComponent {
  private router = inject(Router);
  private modalService = inject(ModalService)

  constructor(private sharedService: SharedService) {}

  SidebarOpen() {
    this.sharedService.buttonClicked()
  }
  
  PostTaks() {
    this.router.navigate(['task']);
    this.modalService.OpenModal();
  }

}
