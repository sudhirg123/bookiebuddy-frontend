import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-stats-card-presenter',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './stats-card.presenter.component.html',
  styleUrl: './stats-card.presenter.component.scss'
})
export class StatsCardPresenterComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) value!: string | number;
  @Input() icon = 'pi pi-chart-bar';
  @Input() helperText?: string;
}
