import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { BookDataService } from '../../core/services/book-data.service';
import { DashboardPresenterComponent } from './dashboard.presenter.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, DashboardPresenterComponent],
  template: `
    <app-dashboard-presenter
      [stats]="stats()"
      [genreChart]="genreChart()"
      [timelineChart]="timelineChart()"
    ></app-dashboard-presenter>
  `
})
export class DashboardContainerComponent {
  private readonly bookDataService = inject(BookDataService);

  readonly stats = this.bookDataService.stats;

  readonly genreChart = computed(() => {
    const stats = this.stats();
    const labels = stats.booksByGenre.map((item) => item.genre);
    const data = stats.booksByGenre.map((item) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            data,
            backgroundColor: ['#7c3aed', '#ec4899', '#22d3ee', '#fbbf24', '#34d399', '#f87171'],
            borderColor: '#ffffff',
            borderWidth: 2
          }
        ]
      },
      options: {
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'var(--text-color)'
            }
          }
        }
      }
    };
  });

  readonly timelineChart = computed(() => {
    const stats = this.stats();
    const labels = stats.readingTimeline.map((item) => item.period);
    const data = stats.readingTimeline.map((item) => item.count);

    return {
      data: {
        labels,
        datasets: [
          {
            label: 'Books finished',
            data,
            borderColor: '#7c3aed',
            backgroundColor: 'rgba(124, 58, 237, 0.18)',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: { color: 'var(--muted-text-color)' },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: 'var(--muted-text-color)', precision: 0 }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'var(--text-color)'
            }
          }
        }
      }
    };
  });
}
