import axiosInstance from "./axios-instance-singleton"

export interface Book {
  id: number;
  titulo: string;
  autores: string[];
  capa: string;
  paginas: number;
  anoDePublicacao: string;
  generos: string[];
  sinopse?: string;
}

export default function BooksService() {

    const getTrendingBooks = async () => {
        try {
            const response = await axiosInstance.get("books/trending");

            const mappedBooks: Book[] = response.data.map((data: any) => ({
                id: data.book_id,
                titulo: data.title,
                autores: data.authors?.split(",").map((a: string) => a.trim()) || [],
                capa: data.google_image_url || data.cover || "",
                paginas: data.pages,
                anoDePublicacao: String(data.year),
                generos: data.genre?.split(",").map((g: string) => g.trim()) || [],
                sinopse: data.synopsis,
            }));

            return mappedBooks;

        } catch (error: any) {
            console.error("Erro ao buscar livros em alta:", error);
            throw error;
        }
    }

    return {
        getTrendingBooks,
    }
    
}
