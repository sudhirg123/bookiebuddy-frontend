import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { Book } from '../../models/book.model';
import { LibraryStats } from '../../models/stats.model';
import { ToastService } from './toast.service';
import { BookApiService } from './book-api.service';
import { firstValueFrom } from 'rxjs';

export type BookDraft = Omit<Book, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  private readonly api = inject(BookApiService);
  private readonly toast = inject(ToastService);

  private readonly booksSignal: WritableSignal<Book[]> = signal<Book[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly statsSignal: WritableSignal<LibraryStats | null> = signal<LibraryStats | null>(null);

  readonly books = this.booksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly stats = computed(() => this.statsSignal() || this.getEmptyStats());

  constructor() {
    this.bootstrap();
  }

  private async bootstrap(): Promise<void> {
    try {
      await this.refreshBooks();
      await this.refreshStats();
    } catch (error) {
      console.error('[BookDataService] Bootstrap failed:', error);
    }
  }

  async refreshBooks(): Promise<void> {
    try {
      this.loadingSignal.set(true);
      const { books } = await firstValueFrom(this.api.listBooks());
      this.booksSignal.set(books);
    } catch (error: any) {
      console.error('[BookDataService] Failed to load books:', error);
      if (error.status === 401) {
        this.toast.error('Authentication required', 'Please log in to view your library.');
      } else {
        this.toast.error('Failed to load books', 'Please check your connection and try again.');
      }
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async refreshStats(): Promise<void> {
    try {
      const stats = await firstValueFrom(this.api.getStats());
      this.statsSignal.set(stats);
    } catch (error: any) {
      console.error('[BookDataService] Failed to load stats:', error);
    }
  }

  getBookById(id: string): Book | undefined {
    return this.booksSignal().find((book) => book.id === id);
  }

  async addBook(draft: BookDraft): Promise<Book | null> {
    this.loadingSignal.set(true);
    try {
      const book = await firstValueFrom(this.api.createBook(draft));

      // Update local state
      this.booksSignal.set([...this.booksSignal(), book]);

      this.toast.success('Book added', `"${book.title}" is now in your library.`);

      // Refresh stats in background
      this.refreshStats();

      return book;
    } catch (error: any) {
      console.error('[BookDataService] Failed to add book:', error);
      this.toast.error('Failed to add book', 'Please try again.');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async updateBook(updated: Book): Promise<Book | null> {
    this.loadingSignal.set(true);
    try {
      const book = await firstValueFrom(this.api.updateBook(updated.id, updated));

      // Update local state
      const updatedBooks = this.booksSignal().map((b) => (b.id === book.id ? book : b));
      this.booksSignal.set(updatedBooks);

      this.toast.success('Book updated', `"${book.title}" has been refreshed.`);

      // Refresh stats in background
      this.refreshStats();

      return book;
    } catch (error: any) {
      console.error('[BookDataService] Failed to update book:', error);
      this.toast.error('Failed to update book', 'Please try again.');
      return null;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async deleteBook(id: string): Promise<boolean> {
    const existing = this.getBookById(id);
    if (!existing) {
      this.toast.error('Book not found', 'The selected book no longer exists.');
      return false;
    }

    this.loadingSignal.set(true);
    try {
      await firstValueFrom(this.api.deleteBook(id));

      // Update local state
      const updatedBooks = this.booksSignal().filter((book) => book.id !== id);
      this.booksSignal.set(updatedBooks);

      this.toast.success('Book removed', `"${existing.title}" has been deleted.`);

      // Refresh stats in background
      this.refreshStats();

      return true;
    } catch (error: any) {
      console.error('[BookDataService] Failed to delete book:', error);
      this.toast.error('Failed to delete book', 'Please try again.');
      return false;
    } finally {
      this.loadingSignal.set(false);
    }
  }

  async exportBooks(): Promise<void> {
    try {
      const blob = await firstValueFrom(this.api.exportBooks());
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `bookiebuddy-library-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
      this.toast.success('Export complete', 'Your library was downloaded successfully.');
    } catch (error: any) {
      console.error('[BookDataService] Failed to export books:', error);
      this.toast.error('Failed to export', 'Please try again.');
    }
  }

  async importBooks(json: string): Promise<boolean> {
    try {
      const payload = JSON.parse(json);
      const books = payload.books || [];

      const result = await firstValueFrom(this.api.importBooks(books));

      if (result.imported > 0) {
        this.toast.success(
          'Import complete',
          `Successfully imported ${result.imported} book(s). ${result.failed} failed.`
        );

        // Refresh data
        await this.refreshBooks();
        await this.refreshStats();

        return true;
      } else {
        this.toast.error('Import failed', 'No books were imported.');
        return false;
      }
    } catch (error: any) {
      console.error('[BookDataService] Failed to import books:', error);
      this.toast.error('Import failed', 'The selected file is not valid.');
      return false;
    }
  }

  async clearLibrary(): Promise<void> {
    // Delete all books one by one
    const books = this.booksSignal();
    for (const book of books) {
      await this.deleteBook(book.id);
    }
  }

  private getEmptyStats(): LibraryStats {
    return {
      totalBooks: 0,
      averageRating: 0,
      booksByGenre: [],
      readingTimeline: [],
      currentStreak: 0
    };
  }
}
