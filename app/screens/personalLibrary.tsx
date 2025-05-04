import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NunitoText from '../components/Texts/NunitoText';
import CustomBook from '../components/Book/CustomBook';
import { useTheme } from '../context/ThemeContext';
import ModalBookDetails from './book';

const { width } = Dimensions.get('window');
  
type Book = {
    id: number;
    title: string;
    author: string;
    photoPath: string;
    size: 'small' | 'medium' | 'large';
  };

  type BookCategory = 'READ' | 'READING' | 'TO_BE_READ';

  interface LibraryProps{
    isVisible: boolean;
    onClose: () => void;
    pageIndex: Number;

  }

const Library: React.FC<LibraryProps> = ({
  isVisible,
  onClose,
  pageIndex = 0,
}) => {
  const { theme } = useTheme();
  const [actualPage, setActualPage] = useState(pageIndex);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [readingBooks, setReadingBooks] = useState<Book[]>([]);
  const [toReadBooks, setToReadBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [modalBookVisible, setModalBookVisible] = useState(false);

  const fetchBooksByArray = async (category: BookCategory) => {
    try {
      const response = await fetch(`http://localhost:3000/personal-library/getBooksArray/${category}`, {
        method: 'GET',
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJpZCI6MSwiaWF0IjoxNzQ2MzY3MDE1LCJleHAiOjE3NDY0NTM0MTV9.xzUHUdFkWsBnS0O5W-2n3nUZsGiBK5Kd-kNdmCyn7jc"
        },
      });


      if (!response.ok) {
        console.error(`Erro ao obter dados para categoria ${category}:`, response.status);
        return;
      }

      const data = await response.json();
      console.log(`Resposta das listas ${category}:`, data);

      const mappedBooks = data.map((item: any) => ({
        id: item.book.book_id,
        isbn: item.book.isbn,
        title: item.book.title,
        genre: item.book.genre,
        authors: item.book.authors,
        cover: item.book.cover,
        synopsis: item.book.synopsis,
        year: item.book.year,
        pages: item.book.pages,
        google_image_url: item.book.google_image_url,
        posts: item.book.posts,
        ratings: item.book.ratings,
        size: 'small' as const,
      }));
      
      if (category === 'READ') {
        setReadBooks(mappedBooks);
      } else if (category === 'READING') {
        setReadingBooks(mappedBooks);
      } else if (category === 'TO_BE_READ') {
        setToReadBooks(mappedBooks);
      }
    }
    catch (error) {
      console.error(`Erro ao buscar livros da categoria ${category}:`, error);
    }
  }

  const changeBar = (index: number) => {
    setActualPage(index);
  };

  const handlePress = (book: Book) => {
    setSelectedBook(book);
    console.log(selectedBook)
    setModalBookVisible(true);
  };

  const handleCloseModal = () => {
    setModalBookVisible(false);
    setSelectedBook(null);
  };
  
  useEffect(() => {
    if (selectedBook) {
      console.log('Livro selecionado:', selectedBook);
    }
  }, [selectedBook]);
  
  useEffect(() => {
    fetchBooksByArray('READ');
    fetchBooksByArray('READING');
    fetchBooksByArray('TO_BE_READ');
  }, []);

  return (
    <Modal
     animationType='slide'
     visible={isVisible}
     onRequestClose={onClose}
     presentationStyle='fullScreen'
    >
    <View style={[styles.container, {backgroundColor: theme.personalLibraryBackground}]}>
      {/* header */}
      <View style={styles.headerPage}>
        <TouchableOpacity onPress={() => console.log('Back button pressed')} style={[styles.circleButton]}>
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={theme.primaryText}
            style={{ paddingRight: 20 }}
          />
        </TouchableOpacity>

        <View style={{ paddingLeft: "13%" }}>
          <NunitoText style={{ fontSize: 20, fontWeight: "bold", color: theme.quinaryText }}>
            Biblioteca Pessoal
          </NunitoText>
        </View>
      </View>

      {/* abas */}
      <View style={styles.tabs}>
        {['Lidos', 'Quero Ler', 'Lendo'].map((nome, index) => (
          <TouchableOpacity key={index} onPress={() => changeBar(index)} style={styles.button}>
            <Text style={[
              styles.textTabs,
              actualPage === index && styles.activeTab,
              { color: actualPage === index ? theme.quinaryText : theme.placeholder }
            ]}>
              {nome}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* barrinha animada */}
      <View style={styles.barContainer}>
        <View
          style={[
            styles.onTopBar,
            {
              width: actualPage === 1
                ? 0.9 * width / 3
                : 0.9 * width / 3.5,
              left: actualPage === 0
                ? 0
                : actualPage === 1
                  ? (0.9 * width / 3)
                  : (0.9 * width / 3) * 2 + ((0.9 * width / 3) - (0.9 * width / 3.5)),
            }
          ]}
        />
      </View>

      {/* conteúdo das abas */}
      <View style={{ flex: 1, width: '100%' }}>
        {actualPage === 0 && (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
            nestedScrollEnabled
          >
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {readBooks.map((book) => (
                    <View key={book.id} style={{paddingHorizontal: 12, paddingVertical: 15}}> 
                        <CustomBook
                          size={book.size}
                          title={book.title}
                          author={book.author}
                          photoPath={book.photoPath}
                          onPress={() => handlePress(book)}
                          bookId={book.id}
                          toPersonalLibrary={true}
                        />
                    </View>
                ))}
            </View>
          </ScrollView>
        )}

        {actualPage === 1 && (
            <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
            nestedScrollEnabled
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {toReadBooks.map((book) => (
                  <View key={book.id} style={{paddingHorizontal: 12, paddingVertical: 15}}> 
                      <CustomBook
                        size={book.size}
                        title={book.title}
                        author={book.author}
                        photoPath={book.photoPath}
                        onPress={() => handlePress(book)}
                        bookId={book.id}
                        toPersonalLibrary={true}
                      />
                    </View>
                ))}
              </View>
            </ScrollView>
        )}

        {actualPage === 2 && (
            <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
            nestedScrollEnabled
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {readingBooks.map((book) => (
                  <View key={book.id} style={{paddingHorizontal: 12, paddingVertical: 15}}> 
                      <CustomBook
                        size={book.size}
                        title={book.title}
                        author={book.author}
                        photoPath={book.photoPath}
                        onPress={() => handlePress(book)}
                        bookId={book.id}
                        toPersonalLibrary={true}
                      />
                  </View>
                ))}
              </View>
            </ScrollView>
        )}
      </View>
    </View>
    {selectedBook && (
      <ModalBookDetails
        visible={modalBookVisible}
        onClose={handleCloseModal}
        rating={selectedBook.ratings[0].rating}
        title={selectedBook.title}
        pages={selectedBook.pages}
        synopsis={selectedBook.synopsis}
        authors={selectedBook.authors}
        google_image_url={selectedBook.google_image_url}
        genre={selectedBook.genre}
        year={selectedBook.year}
        review={selectedBook.review}
        id={selectedBook.id}
      />
    )}
    </Modal>
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
  },
  button: {
    alignItems: 'center',
    paddingBottom: 10,
    paddingHorizontal: 30,
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
    height: 2,
    justifyContent: 'center',
    position: 'absolute',
  },
  tabs: {
    flexDirection: 'row',
    paddingTop: 30,
  },
  textTabs: {
    fontSize: 20,
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
