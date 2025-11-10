import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { LibraryStats } from '../../models/stats.model';
import { StatsCardPresenterComponent } from '../../shared/components/stats-card.presenter.component';

export interface DashboardChartData {
  data: any;
  options: any;
}

@Component({
  selector: 'app-dashboard-presenter',
  standalone: true,
  imports: [CommonModule, CardModule, ChartModule, StatsCardPresenterComponent],
  templateUrl: './dashboard.presenter.component.html',
  styleUrl: './dashboard.presenter.component.scss'
})
export class DashboardPresenterComponent {
  @Input({ required: true }) stats!: LibraryStats;
  @Input({ required: true }) genreChart!: DashboardChartData;
  @Input({ required: true }) timelineChart!: DashboardChartData;
}
