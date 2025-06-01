export type DatabaseBookModel = {
  book_id: number;
  google_book_id: string;
  title: string;
  synopsis: string | null;
  year: number;
  pages: number;
  authors: string;
  google_image_url: string;
  created_at: Date;
};
