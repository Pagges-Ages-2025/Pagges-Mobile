import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NunitoText from '../components/Texts/NunitoText';
import CustomBook from '../components/Book/CustomBook';
import { useTheme } from '../context/ThemeContext';
import ModalBookDetails from './book';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, BookCategory } from '../models/PersonalLibrary';
import personalLibraryService from '../services/personalLibraryService';
const { width } = Dimensions.get('window');

  interface LibraryProps {
    isVisible?: boolean;
    onClose?: () => void;
    pageIndex?: number;
  }

const Library: React.FC<LibraryProps> = ({
  isVisible,
  onClose,
  pageIndex = 0,
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const initialPageIndex = params.pageIndex ? Number(params.pageIndex) : pageIndex;
  
  const [actualPage, setActualPage] = useState(initialPageIndex);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [readingBooks, setReadingBooks] = useState<Book[]>([]);
  const [toReadBooks, setToReadBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [modalBookVisible, setModalBookVisible] = useState(false);
  const [isModalMode] = useState(isVisible !== undefined);
  
  // Handle back button press for standalone screen mode
  useEffect(() => {
    if (!isModalMode) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        router.back();
        return true;
      });
      
      return () => backHandler.remove();
    }
  }, [isModalMode, router]);

  const handleClose = () => {
    if (isModalMode && onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const fetchBooksByArray = async (category: BookCategory) => {
    try {     
      const mappedBooks = await personalLibraryService().fetchBooksByArray(category);
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

  const content = (
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

              {readBooks.length > 0 ? readBooks.map((book) => (
                <View key={book.id} style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
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
              )) : (
                <View style={styles.centered}>
                  <View style={{ paddingBottom: 10, height: 500, alignItems: 'center', justifyContent: 'center' }}>
                    <NunitoText style={{ fontSize: 20, fontWeight: "bold", color: theme.quinaryText }}>
                      Nenhum livro adicionado...
                    </NunitoText>
                    <NunitoText style={{ fontSize: 18, color: theme.quinaryText }}>
                      Adicione um livro à sua biblioteca para ver aqui!
                    </NunitoText>
                  </View>
                </View>
              )}
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
              {toReadBooks.length > 0 ? toReadBooks.map((book) => (
                <View key={book.id} style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
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
              )) :
                (
                  <View style={styles.centered}>
                    <View style={{ paddingBottom: 10, height: 500, alignItems: 'center', justifyContent: 'center' }}>
                      <NunitoText style={{ fontSize: 20, fontWeight: "bold", color: theme.quinaryText }}>
                        Nenhum livro adicionado...
                      </NunitoText>
                      <NunitoText style={{ fontSize: 18, color: theme.quinaryText }}>
                        AKNSDJAKNSDAKJSNDKJASNDAKSJDN
                      </NunitoText>
                    </View>
                  </View>
                )}
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
              {readingBooks.length > 0 ? readingBooks.map((book) => (
                <View key={book.id} style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
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
              )) :
                (
                  <View style={styles.centered}>
                    <View style={{ paddingBottom: 10, height: 500, alignItems: 'center', justifyContent: 'center' }}>
                      <NunitoText style={{ fontSize: 20, fontWeight: "bold", color: theme.quinaryText }}>
                        Nenhum livro adicionado...
                      </NunitoText>
                      <NunitoText style={{ fontSize: 18, color: theme.quinaryText }}>
                        Adicione um livro à sua biblioteca para ver aqui!
                      </NunitoText>
                    </View>
                  </View>
                )}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );

  // Return either as a modal or a direct component
  return isModalMode ? (
    <Modal
     animationType='slide'
     visible={isVisible}
     onRequestClose={handleClose}
     presentationStyle='fullScreen'
    >
      {content}
      {selectedBook && (
        <ModalBookDetails
          visible={modalBookVisible}
          onClose={handleCloseModal}
          rating={selectedBook.ratings?.[0]?.rating ?? 0}
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
  ) : (
    <>
      {content}
      {selectedBook && (
        <ModalBookDetails
          visible={modalBookVisible}
          onClose={handleCloseModal}
          rating={selectedBook.ratings?.[0]?.rating ?? 0}
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
    </>
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
