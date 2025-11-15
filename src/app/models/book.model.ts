export interface Book {
  id: string;
  title: string;
  author: string;
  coverImageUrl: string;
  rating: number;
  reviewHtml: string;
  dateFinished?: string;
  genre: string;
  createdAt: string;
  updatedAt: string;
  googleBooksId?: string;
  googleBooksDescription?: string;
}

export interface BookStoragePayload {
  version: number;
  books: Book[];
}

// API request/response types (snake_case from backend)
export interface BookApiResponse {
  id: string;
  user_id: string;
  title: string;
  author: string;
  cover_image_url: string;
  rating: number;
  review_html: string;
  genre: string;
  date_finished?: string;
  created_at: string;
  updated_at: string;
}

export interface BooksListApiResponse {
  books: BookApiResponse[];
  total: number;
  page: number;
  page_size: number;
}

export interface BookCreateRequest {
  title: string;
  author: string;
  cover_image_url?: string;
  rating: number;
  review_html?: string;
  genre?: string;
  date_finished?: string;
}

export interface StatsApiResponse {
  total_books: number;
  average_rating: number;
  total_pages_read: number;
  current_streak_days: number;
  books_by_genre: Record<string, number>;
  reading_timeline: Array<{
    month: string;
    count: number;
  }>;
}
