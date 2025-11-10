import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';

export interface BookSearchSortOption {
  label: string;
  value: 'recent' | 'highest-rated' | 'alphabetical';
}

@Component({
  selector: 'app-book-search-presenter',
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule, InputTextModule, SelectButtonModule, ButtonModule],
  templateUrl: './book-search.presenter.component.html',
  styleUrl: './book-search.presenter.component.scss'
})
export class BookSearchPresenterComponent {
  @Input() query = '';
  @Input() genres: string[] = [];
  @Input() selectedGenre = 'all';
  @Input() selectedRating: number | 'all' = 'all';
  @Input() selectedSort: BookSearchSortOption['value'] = 'recent';
  @Output() queryChange = new EventEmitter<string>();
  @Output() genreChange = new EventEmitter<string>();
  @Output() ratingChange = new EventEmitter<number | 'all'>();
  @Output() sortChange = new EventEmitter<BookSearchSortOption['value']>();
  @Output() reset = new EventEmitter<void>();

  readonly ratingOptions = [
    { label: 'All ratings', value: 'all' },
    { label: '5 stars', value: 5 },
    { label: '4 stars & up', value: 4 },
    { label: '3 stars & up', value: 3 },
    { label: '2 stars & up', value: 2 }
  ];

  readonly sortOptions: BookSearchSortOption[] = [
    { label: 'Recently added', value: 'recent' },
    { label: 'Highest rated', value: 'highest-rated' },
    { label: 'Alphabetical', value: 'alphabetical' }
  ];

  getGenreOptions(): Array<{ label: string; value: string }> {
    return [{ label: 'All genres', value: 'all' }, ...this.genres.map((genre) => ({ label: genre, value: genre }))];
  }

  onReset(): void {
    this.reset.emit();
  }
}
