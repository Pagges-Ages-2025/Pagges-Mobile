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
            const genresResponse = await retriveUserGenres();
            const genres = genresResponse.data.map((g) => g.genre_name);
            const booksByGenre: Book[] = [];

            const topGenres = genres.slice(0, 3);

            for (const genre of topGenres) {
                const response = await axiosInstance.get(`books/genre/${encodeURIComponent(genre)}`);
                const books = response.data;

                const formattedBooks = Array.isArray(books)
                    ? books.map((data: any) => ({
                        id: data.book_id,
                        title: data.title,
                        authors: data.authors?.split(",").map((a: string) => a.trim()) || [],
                        coverUrl: data.google_image_url || data.cover || "",
                        pages: data.pages,
                        publicationYear: String(data.year),
                        genres: data.genre?.split(",").map((g: string) => g.trim()) || [],
                        synopsis: data.synopsis,
                        avgRating: data.averageRating || 1,
                    }))
                : [];

            booksByGenre.push(...formattedBooks);
        }

        return booksByGenre;
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
