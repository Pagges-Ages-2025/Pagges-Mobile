export class Book {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  isbn: string;
  publishedDate: string;
  publisher: string;
  pageCount: number;
  categories: string[];
  averageRating: number;
  ratingsCount: number;

  constructor(data: any) {
    this.id = data.id;
    this.title = data.title;
    this.author = data.author;
    this.coverUrl = data.coverUrl;
    this.description = data.description;
    this.isbn = data.isbn;
    this.publishedDate = data.publishedDate;
    this.publisher = data.publisher;
    this.pageCount = data.pageCount;
    this.categories = data.categories;
    this.averageRating = data.averageRating;
    this.ratingsCount = data.ratingsCount;
  }
}
