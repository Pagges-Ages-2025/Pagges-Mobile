import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import BookSearch, { Book } from "../components/SearchBar/SearchBar";
import { useTheme } from "../context/ThemeContext";
import SearchAPI from "../services/googleAPIService";
import ModalBookDetails from "./book";

const SearchPage: React.FC = () => {
  const { theme } = useTheme();
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const handleSearch = async (term: string) => {
    setLoading(true);
    try {
      const results = await searchBooks(term);
      setBooks(results);
      console.log(results);
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSelectBook = (book: Book) => {
    console.log("Livro selecionado:", book);
    
    // Garantir que a URL da capa tenha 'zoom=6'
    let updatedCapa = book.capa;
    if (updatedCapa && updatedCapa.includes('zoom=1')) {
      updatedCapa = updatedCapa.replace('zoom=1', 'zoom=6');
    }

    setSelectedBook({ ...book, capa: updatedCapa });
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.Background }]}>
      <View style={styles.content}>
        <BookSearch
          SearchSize="md"
          iconPosition="left"
          iconColor="grey"
          borderRadius="md"
          books={books}
          onSelectBook={handleSelectBook} 
          onSearch={handleSearch}
        />
      </View>

      {selectedBook && (
        <ModalBookDetails
          visible={modalVisible}
          onClose={handleCloseModal}
          titulo={selectedBook.titulo}
          author={selectedBook.autores?.join(", ") || "Autor desconhecido"}
          capa={selectedBook.capa}  // Capa com 'zoom=6'
          paginas={selectedBook.paginas || 0}
          sinopse={selectedBook.sinopse || "Sinopse não disponível"}
          rating={4.0} 
          readersNumber={100} 
          rankingNumber={"5"}
          review="Sem avaliações disponíveis ainda." 
          publicationDate={ "Ano desconhecido"} 
          genre={ "Gênero não especificado"} 
          onCreateReview={() => console.log("Criar resenha para:", selectedBook.titulo)}
          onShare={() => console.log("Compartilhar:", selectedBook.titulo)}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    alignSelf: 'center',
    width: "90%",
    flex: 1,
    paddingTop: 30,
  },
});

export default SearchPage;
