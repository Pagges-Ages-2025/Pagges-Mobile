import axiosInstance from "./axios-instance-singleton";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

    const getAuthToken = async (): Promise<string> => {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) throw new Error("Token não encontrado");
            return token;
    };


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

    const getAverageRating = async (bookId: number): Promise<number> => {
        const token = await getAuthToken();

        try {
        const response = await axiosInstance.get(`/books/avarageRankBook/${bookId}`, {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });

        const average = response.data.average;
        return average ? Math.round(average) : 0;
        } catch (error) {
        console.error("Erro ao buscar média de avaliação:", error);
        return 0;
        }
    };


    const RateBook = async (bookId: number, rating: number): Promise<void> => {
        const token = await getAuthToken();

        try {
        await axiosInstance.post(
            `/books/rate-book`,
            {
            bookId: bookId,
            rating: rating,
            },
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        } catch (error) {
        console.error("Erro ao enviar avaliação:", error);
        throw error;
        }
    };
    
    return {
        getTrendingBooks,
        getAverageRating,
        RateBook,
    }
    
}
