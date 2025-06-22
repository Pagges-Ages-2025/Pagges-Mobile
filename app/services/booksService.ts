import axios from "axios";
import { Book } from "../components/SearchBar/SearchBar";
import { DatabaseBookModel } from "../models/DatabaseBook.model";
import axiosInstance from "./axios-instance-singleton";
export default function BooksService() {
  const getTrendingBooks = async () => {
    try {
      const response = await axiosInstance.get("books/trending");
      console.log("Trending books API response:", response.data);

      const mappedBooks: Book[] = response.data.map((data: any) => {
        console.log("Processing book data:", data);
        console.log("Book genre field:", data.genre);
        console.log("Book BookGenre field:", data.BookGenre);

        return {
          id: data.book_id,
          titulo: data.title,
          autores: data.authors?.split(",").map((a: string) => a.trim()) || [],
          capa: data.google_image_url || data.cover || "",
          paginas: data.pages,
          anoDePublicacao: String(data.year),
          generos:
            data.BookGenre?.map((g: any) => g.genre.genre_name) ||
            data.genre?.split(",").map((g: string) => g.trim()) ||
            [],
          sinopse: data.synopsis,
        };
      });

      console.log("Mapped trending books:", mappedBooks);
      return mappedBooks;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      if (axios.isAxiosError(error) && !error.response) {
        console.error("Erro ao buscar livros em alta:", error);
        throw error;
      }
      throw error;
    }
  };

  const getAverageRating = async (bookId: number): Promise<number> => {
    try {
      console.log("Buscando média de avaliação do livro:", bookId);
      const response = await axiosInstance.get(
        `/books/avarageRankBook/${bookId}`
      );
      console.log("Resposta da API:", response.data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return 0;
      } else {
        console.error("Erro ao buscar média de avaliação:", error);
        throw error;
      }
    }
  };

  const rateBook = async (bookId: number, rating: number): Promise<void> => {
    try {
      console.log("Avaliando livro:", bookId, rating);
      await axiosInstance.post(`/books/rate-book`, {
        book_id: bookId,
        rating: rating,
      });
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error);
      throw error;
    }
  };

  const getBooksByGenre = async (
    genreId: number
  ): Promise<DatabaseBookModel[]> => {
    const response = await axiosInstance.get(`/books/genre/${genreId}`);
    const dabataseBooks: DatabaseBookModel[] = response.data;
    return dabataseBooks;
  };

  const getFavoriteBasedBooks = async (): Promise<Book[]> => {
    try {
      const response = await axiosInstance.get("books/favorites");

      const books = response.data;

      const formattedBooks = Array.isArray(books)
        ? books.map((data: any) => ({
            id: data.book_id,
            titulo: data.title,
            autores:
              data.authors?.split(",").map((a: string) => a.trim()) || [],
            capa: data.google_image_url || data.cover || "",
            paginas: data.pages,
            anoDePublicacao: String(data.year),
            generos: data.BookGenre?.map((g: any) => g.genre.genre_name) || [],
            synopsis: data.synopsis,
            avgRating: data.averageRating || 1,
          }))
        : [];

      return formattedBooks;
    } catch (error) {
      console.error("Erro ao buscar livros baseados nos favoritos:", error);
      throw error;
    }
  };

  return {
    getTrendingBooks,
    getFavoriteBasedBooks,
    getAverageRating,
    RateBook: rateBook,
    getBooksByGenre,
  };
}
