import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { GoogleBook } from '../../models/google-book.model';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

interface GoogleBooksResponse {
  items?: GoogleBook[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);
  private readonly cache = new Map<string, GoogleBook[]>();

  searchBooks(query: string): Observable<GoogleBook[]> {
    const sanitizedQuery = query.trim();
    if (!sanitizedQuery) {
      return of([]);
    }

    const cacheKey = sanitizedQuery.toLowerCase();
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey) ?? []);
    }

    const params = new HttpParams()
      .set('q', sanitizedQuery)
      .set('maxResults', '10')
      .set('printType', 'books');

    return this.http
      .get<GoogleBooksResponse>(environment.googleBooksApiUrl, { params })
      .pipe(
        map((response) => response.items ?? []),
        tap((items) => this.cache.set(cacheKey, items)),
        catchError(() => {
          this.toast.error("Couldn't search books", 'Please try again later.');
          return of([]);
        })
      );
  }

  clearCache(): void {
    this.cache.clear();
  }
}
