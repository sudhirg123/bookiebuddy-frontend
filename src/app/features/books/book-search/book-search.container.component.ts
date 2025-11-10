import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDataService } from '../../../core/services/book-data.service';
import { BookListPresenterComponent } from '../book-list/book-list.presenter.component';
import { BookSearchPresenterComponent } from './book-search.presenter.component';

interface SearchFilters {
  query: string;
  genre: string;
  rating: number | 'all';
  sort: 'recent' | 'highest-rated' | 'alphabetical';
}

@Component({
  selector: 'app-book-search-container',
  standalone: true,
  imports: [CommonModule, BookSearchPresenterComponent, BookListPresenterComponent],
  template: `
    <div class="search-page">
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
        heading="Search results"
        [books]="filteredBooks()"
        [loading]="bookDataService.loading()"
        (view)="viewBook($event)"
        (edit)="editBook($event)"
        (delete)="deleteBook($event)"
        (create)="createBook()"
      ></app-book-list-presenter>
    </div>
  `,
  styles: [
    `
      .search-page {
        display: grid;
        gap: 1.5rem;
      }
    `
  ]
})
export class BookSearchContainerComponent implements OnInit {
  readonly bookDataService = inject(BookDataService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly filters = signal<SearchFilters>({
    query: '',
    genre: 'all',
    rating: 'all',
    sort: 'recent'
  });

  readonly genres = computed(() => {
    const unique = new Set<string>();
    this.bookDataService.books().forEach((book) => unique.add(book.genre));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  });

  readonly filteredBooks = computed(() => {
    const filters = this.filters();
    let books = [...this.bookDataService.books()];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      books = books.filter(
        (book) =>
          book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
    }

    if (filters.genre !== 'all') {
      books = books.filter((book) => book.genre === filters.genre);
    }

    if (filters.rating !== 'all') {
      books = books.filter((book) => book.rating >= Number(filters.rating));
    }

    switch (filters.sort) {
      case 'highest-rated':
        books.sort((a, b) => b.rating - a.rating);
        break;
      case 'alphabetical':
        books.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        books.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    return books;
  });

  ngOnInit(): void {
    const queryParam = this.route.snapshot.queryParamMap.get('q');
    if (queryParam) {
      this.updateFilter('query', queryParam);
    }
  }

  updateFilter<Key extends keyof SearchFilters>(key: Key, value: SearchFilters[Key]): void {
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

  viewBook(id: string): void {
    this.router.navigate(['/books', id]);
  }

  editBook(id: string): void {
    this.router.navigate(['/books', id, 'edit']);
  }

  async deleteBook(id: string): Promise<void> {
    const book = this.bookDataService.getBookById(id);
    if (!book) {
      return;
    }

    const confirmed = window.confirm(`Delete "${book.title}"?`);
    if (!confirmed) {
      return;
    }

    await this.bookDataService.deleteBook(id);
  }

  createBook(): void {
    this.router.navigate(['/books/new']);
  }
}
