import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../app/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of notificationService.toasts()" 
           class="toast" 
           [ngClass]="toast.type"
           (click)="notificationService.remove(toast.id)">
        <span>{{ toast.message }}</span>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }

    .toast {
      pointer-events: auto;
      min-width: 300px;
      padding: 16px;
      border-radius: 8px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border-left: 5px solid #ccc;
      animation: slideIn 0.3s ease-out;
      cursor: pointer;
      font-family: 'Segoe UI', sans-serif;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
    }

    .toast.success { border-left-color: #2ecc71; color: #27ae60; }
    .toast.error { border-left-color: #e74c3c; color: #c0392b; }
    .toast.info { border-left-color: #3498db; color: #2980b9; }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
  notificationService = inject(NotificationService);
}
