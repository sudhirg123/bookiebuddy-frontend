import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-empty-state-presenter',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './empty-state.presenter.component.html',
  styleUrl: './empty-state.presenter.component.scss'
})
export class EmptyStatePresenterComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() actionLabel?: string;
  @Input() icon = 'pi pi-sparkles';
  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}
