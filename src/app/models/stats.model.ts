export interface GenreBreakdown {
  genre: string;
  count: number;
}

export interface TimelineEntry {
  period: string;
  count: number;
}

export interface LibraryStats {
  totalBooks: number;
  averageRating: number;
  booksByGenre: GenreBreakdown[];
  readingTimeline: TimelineEntry[];
  currentStreak: number;
}
