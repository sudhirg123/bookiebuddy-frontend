import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Subject, distinctUntilChanged, filter, debounceTime, switchMap } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BookDataService, BookDraft } from '../../../core/services/book-data.service';
import { GoogleBooksService } from '../../../core/services/google-books.service';
import { GoogleBook } from '../../../models/google-book.model';
import { Book } from '../../../models/book.model';
import { BookFormPresenterComponent } from './book-form.presenter.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-book-form-container',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BookFormPresenterComponent],
  template: `
    <app-book-form-presenter
      [form]="form"
      [mode]="mode()"
      [genres]="genres()"
      [googleResults]="googleResults()"
      [selectedDescription]="selectedDescription()"
      [searching]="searchLoading()"
      [saving]="bookDataService.loading()"
      (submitForm)="submit()"
      (cancel)="cancel()"
      (search)="onSearch($event)"
      (googleBookSelected)="applyGoogleBook($event)"
    ></app-book-form-presenter>
  `
})
export class BookFormContainerComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly bookDataService = inject(BookDataService);
  private readonly googleBooksService = inject(GoogleBooksService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  private readonly searchTerms = new Subject<string>();
  private readonly defaultGenres = new Set([
    'Fantasy',
    'Science Fiction',
    'Adventure',
    'Mystery',
    'Nonfiction',
    'Sports',
    'Contemporary',
    'Historical Fiction',
    'Graphic Novel'
  ]);

  private readonly modeSignal = toSignal(
    this.route.data.pipe(map((data) => (data['mode'] as 'create' | 'edit') ?? 'create')),
    { initialValue: 'create' as const }
  );

  private readonly bookIdSignal = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id'))),
    { initialValue: null }
  );

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    coverImageUrl: ['', [Validators.required]],
    rating: [5, [Validators.required]],
    dateFinished: [new Date()],
    genre: ['', Validators.required],
    reviewHtml: ['I loved this book because...', Validators.required]
  });

  readonly mode = computed(() => this.modeSignal());
  readonly bookId = computed(() => this.bookIdSignal());
  readonly currentBook = computed(() => {
    const id = this.bookId();
    if (!id) {
      return null;
    }
    return this.bookDataService.getBookById(id) ?? null;
  });

  readonly genres = computed(() => {
    const genres = new Set(this.defaultGenres);
    this.bookDataService.books().forEach((book) => {
      if (book.genre) {
        genres.add(book.genre);
      }
    });
    return Array.from(genres.values()).sort((a, b) => a.localeCompare(b));
  });

  readonly googleResults = signal<GoogleBook[]>([]);
  private readonly selectedGoogleInfo = signal<{
    id: string;
    description?: string;
  } | null>(null);
  readonly selectedDescription = computed(() => this.selectedGoogleInfo()?.description ?? null);
  readonly searchLoading = signal(false);

  ngOnInit(): void {
    this.form.markAsUntouched();

    if (this.mode() === 'edit') {
      this.populateFormForEdit();
    }

    this.listenToSearchTerms();
  }

  onSearch(term: string): void {
    this.searchTerms.next(term);
  }

  applyGoogleBook(book: GoogleBook): void {
    const info = book.volumeInfo;
    this.form.patchValue({
      title: info.title ?? '',
      author: info.authors?.join(', ') ?? '',
      coverImageUrl: info.imageLinks?.thumbnail ?? this.form.getRawValue().coverImageUrl,
      genre: info.categories?.[0] ?? this.form.getRawValue().genre
    });

    const fallbackSummary =
      info.description?.trim() ||
      book.searchInfo?.textSnippet?.trim() ||
      info.subtitle?.trim() ||
      (Array.isArray(info.categories) && info.categories.length
        ? `Explore ${info.categories.join(', ')} with this title from ${info.authors?.join(', ') || 'unknown author'}.`
        : null) ||
      null;

    this.selectedGoogleInfo.set({
      id: book.id,
      description: fallbackSummary ?? undefined
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warn('Check the form', 'Please fix validation errors before saving.');
      return;
    }

    const formValue = this.form.getRawValue();
    const draft: BookDraft = {
      title: formValue.title.trim(),
      author: formValue.author.trim(),
      coverImageUrl: formValue.coverImageUrl,
      rating: formValue.rating,
      dateFinished: formValue.dateFinished
        ? new Date(formValue.dateFinished).toISOString()
        : undefined,
      genre: formValue.genre || 'General',
      reviewHtml: formValue.reviewHtml,
      googleBooksId: this.selectedGoogleInfo()?.id ?? this.currentBook()?.googleBooksId,
      googleBooksDescription:
        this.selectedGoogleInfo()?.description ?? this.currentBook()?.googleBooksDescription
    };

    if (this.mode() === 'edit' && this.currentBook()) {
      const existing = this.currentBook() as Book;
      const updated: Book = {
        ...existing,
        ...draft
      };
      const result = await this.bookDataService.updateBook(updated);
      if (result) {
        this.router.navigate(['/books', result.id]);
      }
      return;
    }

    const created = await this.bookDataService.addBook(draft);
    if (created) {
      this.router.navigate(['/books', created.id]);
    }
  }

  cancel(): void {
    if (this.mode() === 'edit' && this.currentBook()) {
      this.router.navigate(['/books', this.currentBook()!.id]);
      return;
    }
    this.router.navigate(['/books']);
  }

  private populateFormForEdit(): void {
    const book = this.currentBook();
    if (!book) {
      this.toastService.error('Book not found', 'Unable to load the selected book.');
      this.router.navigate(['/books']);
      return;
    }

    this.form.patchValue({
      title: book.title,
      author: book.author,
      coverImageUrl: book.coverImageUrl,
      rating: book.rating,
      dateFinished: book.dateFinished ? new Date(book.dateFinished) : undefined,
      genre: book.genre,
      reviewHtml: this.toPlainText(book.reviewHtml)
    });

    if (book.googleBooksId) {
      this.selectedGoogleInfo.set({
        id: book.googleBooksId,
        description: book.googleBooksDescription
      });
    }
  }

  private toPlainText(value: string | null | undefined): string {
    if (!value) {
      return '';
    }
    const withoutTags = value.replace(/<[^>]+>/g, ' ');
    return withoutTags.replace(/\s+/g, ' ').trim();
  }

  private listenToSearchTerms(): void {
    this.searchTerms
      .pipe(
        debounceTime(300),
        map((term) => term.trim()),
        distinctUntilChanged(),
        filter((term) => term.length > 2),
        tap(() => this.searchLoading.set(true)),
        switchMap((term) =>
          this.googleBooksService.searchBooks(term).pipe(
            tap((results) => {
              if (!results.length) {
                this.toastService.info('No results', 'Try a different search query.');
              }
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (results) => {
          this.googleResults.set(results);
          this.searchLoading.set(false);
        },
        error: () => {
          this.searchLoading.set(false);
        }
      });

    this.searchTerms
      .pipe(
        debounceTime(300),
        map((term) => term.trim()),
        filter((term) => term.length <= 2),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.googleResults.set([]);
        this.searchLoading.set(false);
      });
  }
}
