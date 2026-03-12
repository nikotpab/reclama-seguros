import { Injectable, signal } from '@angular/core';

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    showSuccess(message: string) {
        this.addToast(message, 'success');
    }

    showError(message: string) {
        this.addToast(message, 'error');
    }

    showInfo(message: string) {
        this.addToast(message, 'info');
    }

    private addToast(message: string, type: 'success' | 'error' | 'info') {
        const id = this.counter++;
        const newToast: Toast = { message, type, id };

        this.toasts.update(current => [...current, newToast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    remove(id: number) {
        this.toasts.update(current => current.filter(t => t.id !== id));
    }
}
