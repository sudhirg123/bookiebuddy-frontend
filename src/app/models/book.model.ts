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
