import { Book } from "../components/SearchBar/SearchBar";
import axiosInstance from "./axios-instance-singleton";

export async function registerBookInDatabase(
  book: Book
): Promise<RegisterBookDto> {
  try {
    const bookToRegisterDto = {
      google_book_id: String(book.id),
      titulo: book.titulo,
      autores: book.autores,
      google_image_url: book.capa,
      paginas: book.paginas,
      anoDePublicacao: book.anoDePublicacao,
      generos: book.generos,
      sinopse: book.sinopse,
    };

    const axiosResponse = await axiosInstance.post("books/register", {
      ...bookToRegisterDto,
    });
    const registeredBook = new RegisterBookDto({
      book_id: axiosResponse.data.data.book_id,
      google_book_id: axiosResponse.data.data.google_book_id,
      title: axiosResponse.data.data.title,
      authors: axiosResponse.data.data.authors,
      pages: axiosResponse.data.data.pages,
      synopsis: axiosResponse.data.data.synopsis,
      year: axiosResponse.data.data.year,
      google_image_url: axiosResponse.data.data.google_image_url,
    });

    return registeredBook;
  } catch (error) {
    console.error("Erro ao registrar livro:", error);
    throw error;
  }
}

class RegisterBookDto {
  book_id: number;
  googleBookId: string;
  title: string;
  authors: string;
  pages: number | null;
  synopsis: string | null;
  year: number | null;
  imageUrl: string;
  genres: string[];
  averageRating: number | null;

  constructor(data: {
    book_id: number;
    google_book_id: string;
    title: string;
    authors: string | string;
    pages?: number | null;
    synopsis?: string | null;
    year?: number | null;
    google_image_url: string;
    genres?: string[];
    averageRating?: number | null;
    userRating?: number | null;
  }) {
    this.book_id = data.book_id;
    this.googleBookId = data.google_book_id;
    this.title = data.title;
    this.authors = data.authors;
    this.pages = data.pages || null;
    this.synopsis = data.synopsis || null;
    this.year = data.year || null;
    this.imageUrl = data.google_image_url;
    this.genres = data.genres || [];
    this.averageRating = data.averageRating || null;
  }
}

export { RegisterBookDto };
