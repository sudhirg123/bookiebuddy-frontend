import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  Book,
  BookApiResponse,
  BooksListApiResponse,
  BookCreateRequest,
  StatsApiResponse
} from '../../models/book.model';
import { LibraryStats } from '../../models/stats.model';

@Injectable({
  providedIn: 'root'
})
export class BookApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  // Helper to convert API response (snake_case) to frontend model (camelCase)
  private mapBookFromApi(apiBook: BookApiResponse): Book {
    return {
      id: apiBook.id,
      title: apiBook.title,
      author: apiBook.author,
      coverImageUrl: apiBook.cover_image_url,
      rating: apiBook.rating,
      reviewHtml: apiBook.review_html,
      genre: apiBook.genre,
      dateFinished: apiBook.date_finished,
      createdAt: apiBook.created_at,
      updatedAt: apiBook.updated_at
    };
  }

  // Helper to convert frontend model to API request (camelCase to snake_case)
  private mapBookToApi(book: Partial<Book>): Partial<BookCreateRequest> {
    return {
      title: book.title,
      author: book.author,
      cover_image_url: book.coverImageUrl,
      rating: book.rating,
      review_html: book.reviewHtml,
      genre: book.genre,
      date_finished: book.dateFinished
    };
  }

  // List books with optional filters
  listBooks(params?: {
    genre?: string;
    sortBy?: 'date_finished' | 'title' | 'rating';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  }): Observable<{ books: Book[]; total: number }> {
    let httpParams = new HttpParams();

    if (params?.genre) {
      httpParams = httpParams.set('genre', params.genre);
    }
    if (params?.sortBy) {
      httpParams = httpParams.set('sort_by', params.sortBy);
    }
    if (params?.sortOrder) {
      httpParams = httpParams.set('sort_order', params.sortOrder);
    }
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.pageSize) {
      httpParams = httpParams.set('page_size', params.pageSize.toString());
    }

    return this.http.get<BooksListApiResponse>(`${this.baseUrl}/books`, { params: httpParams }).pipe(
      map((response) => ({
        books: response.books.map((b) => this.mapBookFromApi(b)),
        total: response.total
      }))
    );
  }

  // Get a single book by ID
  getBook(bookId: string): Observable<Book> {
    return this.http
      .get<BookApiResponse>(`${this.baseUrl}/books/${bookId}`)
      .pipe(map((apiBook) => this.mapBookFromApi(apiBook)));
  }

  // Create a new book
  createBook(book: Partial<Book>): Observable<Book> {
    const apiBook = this.mapBookToApi(book);
    return this.http
      .post<BookApiResponse>(`${this.baseUrl}/books`, apiBook)
      .pipe(map((apiBook) => this.mapBookFromApi(apiBook)));
  }

  // Update an existing book
  updateBook(bookId: string, book: Partial<Book>): Observable<Book> {
    const apiBook = this.mapBookToApi(book);
    return this.http
      .put<BookApiResponse>(`${this.baseUrl}/books/${bookId}`, apiBook)
      .pipe(map((apiBook) => this.mapBookFromApi(apiBook)));
  }

  // Delete a book
  deleteBook(bookId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/books/${bookId}`);
  }

  // Get library statistics
  getStats(): Observable<LibraryStats> {
    return this.http.get<StatsApiResponse>(`${this.baseUrl}/stats`).pipe(
      map((apiStats) => ({
        totalBooks: apiStats.total_books,
        averageRating: apiStats.average_rating,
        booksByGenre: Object.entries(apiStats.books_by_genre).map(([genre, count]) => ({
          genre,
          count
        })),
        readingTimeline: apiStats.reading_timeline.map((item) => ({
          period: item.month,
          count: item.count
        })),
        currentStreak: apiStats.current_streak_days
      }))
    );
  }

  // Import books
  importBooks(books: Partial<Book>[]): Observable<{ imported: number; failed: number; errors: string[] }> {
    const apiBooks = books.map((b) => this.mapBookToApi(b));
    return this.http.post<{ imported: number; failed: number; errors: string[] }>(
      `${this.baseUrl}/books/import`,
      { books: apiBooks }
    );
  }

  // Export books
  exportBooks(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/books/export`, { responseType: 'blob' });
  }

  // Health check
  healthCheck(): Observable<{ status: string; timestamp: string }> {
    return this.http.get<{ status: string; timestamp: string }>(`${this.baseUrl}/health`);
  }
}
