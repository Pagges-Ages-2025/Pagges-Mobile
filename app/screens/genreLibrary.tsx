import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NunitoText from '../components/Texts/NunitoText';
import CustomBook from '../components/Book/CustomBook';
import { useTheme } from '../context/ThemeContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
//import { Book } from '../models/genreLibrary';
import { Book } from "../components/SearchBar/SearchBar";
import SearchAPI from '../services/googleAPIService';
import { registerBookInDatabase } from '../services/handle-select-book.service';
const { width } = Dimensions.get('window');

  interface LibraryProps {
    onClose?: () => void;
    pageIndex?: number;
  }

const Library: React.FC<LibraryProps> = ({
  onClose,
  pageIndex = 0,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialPageIndex = params.pageIndex ? Number(params.pageIndex) : pageIndex;
  const selectedGenres = params.selectedGenre.toString();
  
  const [actualPage] = useState(initialPageIndex);
  const [toGenreBooks, setGenreBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const slideAnim = useRef(new Animated.Value(actualPage)).current;
  const { searchBooks } = SearchAPI();

  const handleClose = () => {
      router.back();
  };

  const fetchBooks = async (genres: string) => {
    try {     
      const mappedBooks = await searchBooks(genres);
      setGenreBooks(mappedBooks);
      setLoading(false);
    }
    catch (error) {
      console.error(`Erro ao buscar livros do genero ${genres}:`, error);
    }
  }

  // Inicializa a animação com o valor correto quando o componente é montado
  useEffect(() => {
    slideAnim.setValue(initialPageIndex);
  }, []);

    const handleSelectBook = (book: Book) => {
      registerBookInDatabase(book);
      setSelectedBook(book);
      //onSelectBook && onSelectBook(book);
    };
  
  useEffect(() => {
    if (selectedBook) {
      console.log('Livro selecionado:', selectedBook);
    }
  }, [selectedBook]);
  
  useEffect(() => {
    fetchBooks(selectedGenres);
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.personalLibraryBackground}]}>
      {/* header */}
      <View style={styles.headerPage}>
        <TouchableOpacity onPress={handleClose} style={[styles.circleButton]}>
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={theme.primaryText}
            style={{ paddingRight: 20 }}
          />
        </TouchableOpacity>

        <View style={{ paddingLeft: "13%" }}>
          <NunitoText style={{ fontSize: 20, fontWeight: "bold", color: theme.quinaryText }}>
            {selectedGenres}
          </NunitoText>
        </View>
      </View>

      <View style={{ flex: 1, width: '100%' }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          style={{ flex: 1 }}
          nestedScrollEnabled
        >
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>

            {loading ? (
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginLeft: 10, marginTop: 20 }}
              />
            ):
            toGenreBooks.length > 0 ? toGenreBooks.map((book) => (
              <>
              <View key={book.id} style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
                <CustomBook
                  size={"small"}
                  photoPath={book.capa}
                  onPress={() => handleSelectBook(book)}
                  bookId={book.id}
                />
                <NunitoText style={{ fontSize: 14, maxWidth:100, textAlign: 'center', color: theme.quinaryText, fontWeight:'bold'}}>
                  {book.titulo}
                </NunitoText>
                <NunitoText style={{ paddingTop:5, fontSize: 12, maxWidth:100, textAlign: 'center', color: theme.quinaryText,fontWeight: 'bold'}}>
                  {book.autores}
                </NunitoText>
              </View>
              </>
            )) : (
              <View style={styles.centered}>
                <View style={{ paddingBottom: 10, height: 500, alignItems: 'center', justifyContent: 'center' }}>
                  <NunitoText style={{ fontSize: 18, fontWeight: "bold", color: theme.quinaryText }}>
                    Nenhum livro de {selectedGenres} encontrado...
                  </NunitoText>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  activeTab: {
    fontWeight: 'bold',
  },
  barContainer: {
    alignItems: 'center',
    height: 2,
    justifyContent: 'center',
    position: 'relative',
    width: '90%',
    marginBottom: 15,
  },
  button: {
    alignItems: 'center',
    paddingBottom: 10,
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  circleButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 3,
    width: 40,
  },
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  headerPage: {
    alignItems: 'center',
    flexDirection: "row",
    marginTop: 80,
    paddingLeft: 30,
    width: '100%',
  },
  onTopBar: {
    alignItems: 'center',
    backgroundColor: '#9D0F54',
    bottom: 0,
    height: 3,
    justifyContent: 'center',
    position: 'absolute',
    borderRadius: 1.5,
  },
  tabs: {
    flexDirection: 'row',
    paddingTop: 30,
    width: '90%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  textTabs: {
    fontSize: 20,
    textAlign: 'center',
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
