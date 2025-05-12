export type BookCategory = 'READ' | 'READING' | 'TO_BE_READ';

export class Book {
    id: number;
    title: string;
    author: string;
    photoPath: string;
    size: 'small' | 'medium' | 'large';

    constructor({
        id,
        title,
        author,
        photoPath,
        size,
    }: {
        id: number;
        title: string;
        author: string;
        photoPath: string;
        size: 'small' | 'medium' | 'large';
    }) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.photoPath = photoPath;
        this.size = size;
    }
}

export class PersonalLibrary {
    id: number;
    isbn?: string;
    title?: string;
    genre?: string;
    authors?: string;
    cover?: string;
    photoPath?: string;
    synopsis?: string;
    year?: number;
    pages?: number;
    google_image_url?: string;
    posts?: number;
    ratings?: {rating:number}[];
    size?: string;
    author?: string;

    constructor({
        id,
        isbn,
        title,
        genre,
        authors,
        cover,
        photoPath,
        synopsis,
        year,
        pages,
        google_image_url,
        posts,
        ratings,
        size,
        author,
    }: {
        id: number;
        isbn?: string;
        title?: string;
        genre?: string;
        authors?: string;
        cover?: string;
        photoPath?: string;
        synopsis?: string;
        year?: number;
        pages?: number;
        google_image_url?: string;
        posts?: number;
        ratings?: {rating:number}[];
        size?: "small";
        author?: string;
    }) {
        this.id = id;
        this.isbn = isbn;
        this.title = title;
        this.genre = genre;
        this.authors = authors;
        this.cover = cover;
        this.photoPath = photoPath;
        this.synopsis = synopsis;
        this.year = year;
        this.pages = pages;
        this.google_image_url = google_image_url;
        this.posts = posts;
        this.ratings = ratings;
        this.size = size;
        this.author = author;
    }
  }
