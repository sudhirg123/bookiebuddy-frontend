import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BookDataService } from '../../../core/services/book-data.service';
import { BookListPresenterComponent } from './book-list.presenter.component';
import { BookSearchPresenterComponent } from '../book-search/book-search.presenter.component';

interface BookFilters {
  query: string;
  genre: string;
  rating: number | 'all';
  sort: 'recent' | 'highest-rated' | 'alphabetical';
}

@Component({
  selector: 'app-book-list-container',
  standalone: true,
  imports: [CommonModule, BookSearchPresenterComponent, BookListPresenterComponent],
  template: `
    <div class="book-list-page">
      <app-book-search-presenter
        [query]="filters().query"
        [genres]="genres()"
        [selectedGenre]="filters().genre"
        [selectedRating]="filters().rating"
        [selectedSort]="filters().sort"
        (queryChange)="updateFilter('query', $event)"
        (genreChange)="updateFilter('genre', $event)"
        (ratingChange)="updateFilter('rating', $event)"
        (sortChange)="updateFilter('sort', $event)"
        (reset)="resetFilters()"
      ></app-book-search-presenter>

      <app-book-list-presenter
        [books]="filteredBooks()"
        [loading]="loading()"
        (view)="viewBook($event)"
        (edit)="editBook($event)"
        (delete)="deleteBook($event)"
        (create)="navigateToCreate()"
      ></app-book-list-presenter>
    </div>
  `,
  styles: [
    `
      .book-list-page {
        display: grid;
        gap: clamp(1.5rem, 3vw, 2.5rem);
      }
    `
  ]
})
export class BookListContainerComponent {
  private readonly bookDataService = inject(BookDataService);
  private readonly router = inject(Router);

  readonly books = this.bookDataService.books;
  readonly loading = this.bookDataService.loading;
  readonly filters = signal<BookFilters>({
    query: '',
    genre: 'all',
    rating: 'all',
    sort: 'recent'
  });

  readonly genres = computed(() => {
    const genreSet = new Set<string>();
    this.books().forEach((book) => {
      if (book.genre) {
        genreSet.add(book.genre);
      }
    });
    return Array.from(genreSet.values()).sort((a, b) => a.localeCompare(b));
  });

  readonly filteredBooks = computed(() => {
    const filters = this.filters();
    let result = [...this.books()];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
    }

    if (filters.genre !== 'all') {
      result = result.filter((book) => book.genre === filters.genre);
    }

    if (filters.rating !== 'all') {
      result = result.filter((book) => book.rating >= Number(filters.rating));
    }

    switch (filters.sort) {
      case 'highest-rated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  });

  updateFilter<Key extends keyof BookFilters>(key: Key, value: BookFilters[Key]): void {
    this.filters.update((current) => ({ ...current, [key]: value }));
  }

  resetFilters(): void {
    this.filters.set({
      query: '',
      genre: 'all',
      rating: 'all',
      sort: 'recent'
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/books/new']);
  }

  viewBook(id: string): void {
    this.router.navigate(['/books', id]);
  }

  editBook(id: string): void {
    this.router.navigate(['/books', id, 'edit']);
  }

  async deleteBook(id: string): Promise<void> {
    const book = this.books().find((item) => item.id === id);
    if (!book) {
      return;
    }

    const confirmed = window.confirm(`Delete "${book.title}" from your library?`);
    if (!confirmed) {
      return;
    }

    await this.bookDataService.deleteBook(id);
  }
}
