import { Book, BookCategory } from "../models/PersonalLibrary";
import axiosInstance from "./axios-instance-singleton";

export default function PersonalLibraryService() {
  const fetchBooksByArray = async (category: BookCategory): Promise<Book[]> => {
    try {
      const response = await axiosInstance.get(
        `/personal-library/getBooksArray/${category}`
      );

      const mappedBooks = response.data.map(
        (item: any) =>
          new Book({
            id: item.book.book_id,
            title: item.book.title,
            photoPath: item.book.google_image_url || item.book.cover, // Usando google_image_url ou cover como fallback
            author: item.book.authors, // Adicionando o autor para exibição
            size: "small" as const,
          })
      );

      return mappedBooks;
    } catch (error) {
      console.error(`Erro ao buscar livros da categoria ${category}:`, error);
      throw error;
    }
  };

  const addBookToLibrary = async (bookId: string, state: string) => {
    try {
      const response = await axiosInstance.put(
        `/personal-library/addBook/${bookId}`,
        state
      );
      return response
    } catch (error) {
      console.error(`Erro ao livro à biblioteca`);
      throw error;
    }
  };

  return {
    fetchBooksByArray,
    addBookToLibrary,
  };
}
