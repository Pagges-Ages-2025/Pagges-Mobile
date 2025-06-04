import axiosInstance from "./axios-instance-singleton";
import { retriveUserGenres } from "../services/genres.service";

export interface Book {
  id: number;
  title: string;
  authors: string[];
  coverUrl: string;
  pages: number;
  publicationYear: string;
  genres: string[];
  synopsis?: string;
  avgRating?: number;
}

export default function BooksService() {

    const getTrendingBooks = async () => {
        try {
            const response = await axiosInstance.get("books/trending");

            const mappedBooks: Book[] = response.data.map((data: any) => ({
                id: data.book_id,
                title: data.title,
                authors: data.authors?.split(",").map((a: string) => a.trim()) || [],
                coverUrl: data.google_image_url || data.cover || "",
                pages: data.pages,
                publicationYear: String(data.year),
                genres: data.genre?.split(",").map((g: string) => g.trim()) || [],
                synopsis: data.synopsis,
                avgRating: data.averageRating || 1,
            }));

            return mappedBooks;

        } catch (error: any) {
            console.error("Erro ao buscar livros em alta:", error);
            throw error;
        }
    }

    const getFavoriteBasedBooks = async (): Promise<Book[]> => {
        try {
            const response = await axiosInstance.get("books/favorites"); // nova rota

            const books = response.data;

            const formattedBooks = Array.isArray(books)
                ? books.map((data: any) => ({
                    id: data.book_id,
                    title: data.title,
                    authors: data.authors?.split(",").map((a: string) => a.trim()) || [],
                    coverUrl: data.google_image_url || data.cover || "",
                    pages: data.pages,
                    publicationYear: String(data.year),
                    genres: data.BookGenre?.map((g: any) => g.genre.genre_name) || [],
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
        getFavoriteBasedBooks
    }
    
}

// corrigir o getFavoriteBasedBooks. está completamente errado
// 1. usar @user token info para pegar id do usuario
// 2. com id do usuario, realizar busca com prisma para pegar o id dos generos favoritos
// 3. com os ids dos generos favoritos, fazer a busca na tabela de livros pegando
// somente os livros que correspondem ao id dos generos
// colocar no prisma a configuração de take: 12
// fazer isso no module de books
