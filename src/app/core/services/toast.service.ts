import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

interface MessageOptions {
  severity?: 'success' | 'info' | 'warn' | 'error';
  summary?: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly messageService = inject(MessageService);

  show(message: MessageOptions): void {
    this.messageService.add({
      life: 4000,
      closable: true,
      ...message
    });
  }

  success(summary: string, detail?: string): void {
    this.show({ severity: 'success', summary, detail });
  }

  info(summary: string, detail?: string): void {
    this.show({ severity: 'info', summary, detail });
  }

  warn(summary: string, detail?: string): void {
    this.show({ severity: 'warn', summary, detail });
  }

  error(summary: string, detail?: string): void {
    this.show({ severity: 'error', summary, detail });
  }

  clear(): void {
    this.messageService.clear();
  }
}
