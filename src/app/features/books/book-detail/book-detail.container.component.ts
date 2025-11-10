import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { BookDataService } from '../../../core/services/book-data.service';
import { BookDetailPresenterComponent } from './book-detail.presenter.component';
import { EmptyStatePresenterComponent } from '../../../shared/components/empty-state.presenter.component';

@Component({
  selector: 'app-book-detail-container',
  standalone: true,
  imports: [CommonModule, BookDetailPresenterComponent, EmptyStatePresenterComponent],
  template: `
    <ng-container *ngIf="book(); else empty">
      <app-book-detail-presenter
        [book]="book()!"
        [googleDescription]="book()?.googleBooksDescription"
        (edit)="onEdit($event)"
        (delete)="onDelete($event)"
      ></app-book-detail-presenter>
    </ng-container>

    <ng-template #empty>
      <app-empty-state-presenter
        title="Book not found"
        message="We couldn't find this book in your library. It might have been removed."
        actionLabel="Back to library"
        icon="pi pi-compass"
        (action)="backToLibrary()"
      ></app-empty-state-presenter>
    </ng-template>
  `
})
export class BookDetailContainerComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookDataService = inject(BookDataService);

  private readonly bookId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null }
  );

  readonly book = computed(() => {
    const id = this.bookId();
    if (!id) {
      return null;
    }
    return this.bookDataService.getBookById(id) ?? null;
  });

  onEdit(id: string): void {
    this.router.navigate(['/books', id, 'edit']);
  }

  async onDelete(id: string): Promise<void> {
    const book = this.book();
    if (!book) {
      return;
    }

    const confirmed = window.confirm(`Remove "${book.title}" from your library?`);
    if (!confirmed) {
      return;
    }

    const deleted = await this.bookDataService.deleteBook(id);
    if (deleted) {
      this.backToLibrary();
    }
  }

  backToLibrary(): void {
    this.router.navigate(['/books']);
  }
}
