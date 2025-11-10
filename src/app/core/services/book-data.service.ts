import { Injectable, WritableSignal, computed, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Book, BookStoragePayload } from '../../models/book.model';
import { LibraryStats } from '../../models/stats.model';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

export type BookDraft = Omit<Book, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };

const STORAGE_KEY = environment.storage.booksKey;
const STORAGE_VERSION = 1;
const SIMULATED_DELAY_MS = environment.mockApiDelay;

@Injectable({
  providedIn: 'root'
})
export class BookDataService {
  private readonly storage = inject(StorageService);
  private readonly toast = inject(ToastService);

  private readonly booksSignal: WritableSignal<Book[]> = signal<Book[]>([]);
  private readonly loadingSignal = signal(false);

  readonly books = this.booksSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly stats = computed(() => this.calculateStats());

  constructor() {
    this.bootstrap();
  }

  getBookById(id: string): Book | undefined {
    return this.booksSignal().find((book) => book.id === id);
  }

  async addBook(draft: BookDraft): Promise<Book | null> {
    await this.simulateDelay();
    const now = new Date().toISOString();
    const book: Book = {
      ...draft,
      id: draft.id ?? this.generateId(),
      createdAt: now,
      updatedAt: now
    };

    const updatedBooks = [...this.booksSignal(), book];
    if (!this.persistBooks(updatedBooks)) {
      return null;
    }

    this.booksSignal.set(updatedBooks);
    this.toast.success('Book added', `"${book.title}" is now in your library.`);
    return book;
  }

  async updateBook(updated: Book): Promise<Book | null> {
    await this.simulateDelay();
    const existing = this.getBookById(updated.id);
    if (!existing) {
      this.toast.error('Book not found', 'Unable to update. Please try again.');
      return null;
    }

    const now = new Date().toISOString();
    const merged: Book = { ...existing, ...updated, updatedAt: now };
    const updatedBooks = this.booksSignal().map((book) => (book.id === merged.id ? merged : book));

    if (!this.persistBooks(updatedBooks)) {
      return null;
    }

    this.booksSignal.set(updatedBooks);
    this.toast.success('Book updated', `"${merged.title}" has been refreshed.`);
    return merged;
  }

  async deleteBook(id: string): Promise<boolean> {
    await this.simulateDelay();
    const existing = this.getBookById(id);
    if (!existing) {
      this.toast.error('Book not found', 'The selected book no longer exists.');
      return false;
    }

    const updatedBooks = this.booksSignal().filter((book) => book.id !== id);
    if (!this.persistBooks(updatedBooks)) {
      return false;
    }

    this.booksSignal.set(updatedBooks);
    this.toast.success('Book removed', `"${existing.title}" has been deleted.`);
    return true;
  }

  exportBooks(): string | null {
    const payload: BookStoragePayload = {
      version: STORAGE_VERSION,
      books: this.booksSignal()
    };
    const content = JSON.stringify(payload, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `bookiebuddy-library-${new Date().toISOString().slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    this.toast.success('Export complete', 'Your library was downloaded successfully.');
    return content;
  }

  importBooks(json: string): boolean {
    try {
      const payload = JSON.parse(json) as BookStoragePayload;
      if (payload.version !== STORAGE_VERSION || !Array.isArray(payload.books)) {
        throw new Error('Invalid payload');
      }

      if (!this.persistBooks(payload.books)) {
        return false;
      }

      this.booksSignal.set(payload.books);
      this.toast.success('Import complete', 'Your library was restored.');
      return true;
    } catch {
      this.toast.error('Import failed', 'The selected file is not a valid BookieBuddy export.');
      return false;
    }
  }

  clearLibrary(): void {
    this.persistBooks([]);
    this.booksSignal.set([]);
  }

  private bootstrap(): void {
    const payload = this.storage.getItem<BookStoragePayload>(STORAGE_KEY);
    if (payload?.version === STORAGE_VERSION && Array.isArray(payload.books) && payload.books.length) {
      this.booksSignal.set(payload.books);
      return;
    }

    const seeded = this.createMockBooks();
    this.persistBooks(seeded);
    this.booksSignal.set(seeded);
  }

  private persistBooks(books: Book[]): boolean {
    try {
      const payload: BookStoragePayload = {
        version: STORAGE_VERSION,
        books
      };
      this.storage.setItem(STORAGE_KEY, payload);
      return true;
    } catch {
      this.toast.warn(
        'Storage limit reached',
        'Unable to save your changes. Please export your library and clear space.'
      );
      return false;
    }
  }

  private async simulateDelay(): Promise<void> {
    this.loadingSignal.set(true);
    await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
    this.loadingSignal.set(false);
  }

  private calculateStats(): LibraryStats {
    const books = this.booksSignal();
    const totalBooks = books.length;
    const averageRating =
      totalBooks > 0
        ? Math.round((books.reduce((sum, book) => sum + (book.rating ?? 0), 0) / totalBooks) * 10) /
          10
        : 0;

    const genreMap = new Map<string, number>();
    const timelineMap = new Map<string, number>();
    const finishedDates = new Set<string>();

    for (const book of books) {
      const genre = book.genre || 'Unknown';
      genreMap.set(genre, (genreMap.get(genre) ?? 0) + 1);

      if (book.dateFinished) {
        const monthKey = book.dateFinished.slice(0, 7);
        timelineMap.set(monthKey, (timelineMap.get(monthKey) ?? 0) + 1);
        finishedDates.add(book.dateFinished.slice(0, 10));
      }
    }

    const booksByGenre = Array.from(genreMap.entries())
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    const readingTimeline = Array.from(timelineMap.entries())
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));

    const currentStreak = this.calculateStreak(finishedDates);

    return {
      totalBooks,
      averageRating,
      booksByGenre,
      readingTimeline,
      currentStreak
    };
  }

  private calculateStreak(finishedDates: Set<string>): number {
    if (finishedDates.size === 0) {
      return 0;
    }

    const today = new Date();
    let streak = 0;
    const format = (date: Date) => date.toISOString().slice(0, 10);

    while (streak < 365) {
      const dateKey = format(new Date(today.getFullYear(), today.getMonth(), today.getDate() - streak));
      if (!finishedDates.has(dateKey)) {
        break;
      }
      streak += 1;
    }

    return streak;
  }

  private generateId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }

    return `book_${Math.random().toString(36).slice(2, 11)}`;
  }

  private createMockBooks(): Book[] {
    const now = new Date();
    const iso = (offsetDays: number) => {
      const date = new Date(now);
      date.setDate(date.getDate() - offsetDays);
      return date.toISOString();
    };

    return [
      {
        id: this.generateId(),
        title: 'The Quest for the Emerald Crown',
        author: 'Lena Brightmoon',
        coverImageUrl:
          'https://images.unsplash.com/photo-1455884981814-7c2ad4285c64?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        reviewHtml:
          '<p>An adventurous fantasy filled with clever riddles and brave friendships.</p>',
        dateFinished: iso(2),
        genre: 'Fantasy',
        createdAt: iso(30),
        updatedAt: iso(2),
        googleBooksId: undefined,
        googleBooksDescription:
          'Twelve-year-old Mia embarks on a magical quest to restore balance to her kingdom.'
      },
      {
        id: this.generateId(),
        title: 'Gizmo’s Galactic Field Trip',
        author: 'Toby Sparks',
        coverImageUrl:
          'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=400&q=80',
        rating: 4,
        reviewHtml:
          '<p>Funny, fast-paced sci-fi with lots of laugh-out-loud inventions.</p>',
        dateFinished: iso(15),
        genre: 'Science Fiction',
        createdAt: iso(60),
        updatedAt: iso(15),
        googleBooksId: undefined,
        googleBooksDescription:
          'Gizmo the gadget genius blasts off on a surprise field trip to the moon.'
      },
      {
        id: this.generateId(),
        title: 'Mystery at Maplewood Manor',
        author: 'Avery Quinn',
        coverImageUrl:
          'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        reviewHtml:
          '<p>A clever whodunit with clues hidden in each chapter and a satisfying reveal.</p>',
        dateFinished: iso(28),
        genre: 'Mystery',
        createdAt: iso(90),
        updatedAt: iso(28),
        googleBooksId: undefined,
        googleBooksDescription:
          'Sloane and friends solve the secrets of an old manor before the school fundraiser.'
      },
      {
        id: this.generateId(),
        title: 'Secrets of the Silver Sea',
        author: 'Mira Coral',
        coverImageUrl:
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
        rating: 4,
        reviewHtml:
          '<p>Beautiful ocean world-building with brave siblings and mythical creatures.</p>',
        dateFinished: iso(40),
        genre: 'Adventure',
        createdAt: iso(120),
        updatedAt: iso(40),
        googleBooksId: undefined,
        googleBooksDescription: 'Two siblings search for hidden treasure beneath glowing tides.'
      },
      {
        id: this.generateId(),
        title: 'The Timekeeper’s Apprentice',
        author: 'Juniper Wells',
        coverImageUrl:
          'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=400&q=80',
        rating: 5,
        reviewHtml:
          '<p>A smart time travel story that asks great what-if questions about choices.</p>',
        dateFinished: iso(55),
        genre: 'Science Fiction',
        createdAt: iso(140),
        updatedAt: iso(55),
        googleBooksId: undefined,
        googleBooksDescription:
          'Ellie learns to mend moments in time before they unravel her town.'
      },
      {
        id: this.generateId(),
        title: 'Champions on the Court',
        author: 'Diego Morales',
        coverImageUrl:
          'https://images.unsplash.com/photo-1518373714866-3f1478910a8a?auto=format&fit=crop&w=400&q=80',
        rating: 3,
        reviewHtml:
          '<p>Great for sports fans with inspiring teamwork and practice tips.</p>',
        dateFinished: iso(65),
        genre: 'Sports',
        createdAt: iso(160),
        updatedAt: iso(65),
        googleBooksId: undefined,
        googleBooksDescription:
          'A middle school basketball team learns resilience on their playoff journey.'
      },
      {
        id: this.generateId(),
        title: 'Cooking Up Kindness',
        author: 'Sasha Bloom',
        coverImageUrl:
          'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80',
        rating: 4,
        reviewHtml:
          '<p>Sweet contemporary story about friendship, food and community service.</p>',
        dateFinished: iso(75),
        genre: 'Contemporary',
        createdAt: iso(180),
        updatedAt: iso(75),
        googleBooksId: undefined,
        googleBooksDescription:
          'A kid chef starts a kindness club that serves meals to neighbors in need.'
      }
    ];
  }
}
