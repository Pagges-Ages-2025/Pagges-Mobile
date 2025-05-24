import { Book } from "../components/SearchBar/SearchBar";
import axiosInstance from "./axios-instance-singleton";

export async function registerBookInDatabase(book: Book) {
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

  try {
    const axiosResponse = await axiosInstance.post("books/register", {
      ...bookToRegisterDto,
    });
  } catch (error) {
    console.error("Erro ao registrar livro:", error);
  }
}
