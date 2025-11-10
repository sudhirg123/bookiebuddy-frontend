import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-rating-display-presenter',
  standalone: true,
  imports: [CommonModule, FormsModule, RatingModule],
  template: `
    <p-rating
      class="rating-display"
      [(ngModel)]="value"
      [readonly]="true"
      [stars]="max"
    ></p-rating>
    <span class="rating-value">{{ value | number: '1.1-1' }}/{{ max }}</span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }

      .rating-value {
        font-size: 0.85rem;
        color: var(--muted-text-color);
      }
    `
  ]
})
export class RatingDisplayPresenterComponent {
  @Input({ required: true }) value = 0;
  @Input() max = 5;
}
