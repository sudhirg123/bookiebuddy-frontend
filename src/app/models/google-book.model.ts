export interface GoogleBookVolumeInfo {
  title: string;
  authors?: string[];
  description?: string;
  subtitle?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  publishedDate?: string;
  categories?: string[];
}

export interface GoogleBook {
  id: string;
  volumeInfo: GoogleBookVolumeInfo;
  searchInfo?: {
    textSnippet?: string;
  };
}
