import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NunitoText from '../components/Texts/NunitoText';
import CustomBook from '../components/Book/CustomBook';
import { useTheme } from '../context/ThemeContext';
import {
    mockReadBooks,
    mockReadingBooks,
    mockToReadBooks,
  } from './tests/mocks/book';  

const { width } = Dimensions.get('window');
  
type Book = {
    id: number;
    title: string;
    photoPath: string;
    size: 'small' | 'medium' | 'large'; // ou só string se for mais flexível
  };

const Library = () => {
  const { theme } = useTheme();
  const [actualPage, setActualPage] = useState(0);
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [readingBooks, setReadingBooks] = useState<Book[]>([]);
  const [toReadBooks, setToReadBooks] = useState<Book[]>([]);

  const changeBar = (index: number) => {
    setActualPage(index);
  };

  const handlePress = () => {
    console.log('Livro clicado!');
  };

  useEffect(() => {
    const fetchBooks = async () => {
      const response = await new Promise<{
        read: Book[];
        reading: Book[];
        toRead: Book[];
      }>((resolve) => {
        setTimeout(() => {
          resolve({
            read: mockReadBooks,
            reading: mockReadingBooks,
            toRead: mockToReadBooks,
          });
        }, 1000);
      });
  
      setReadBooks(response.read);
      setReadingBooks(response.reading);
      setToReadBooks(response.toRead);
    };
  
    fetchBooks();
  }, []);
  

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.headerPage}>
        <TouchableOpacity onPress={() => console.log('Back button pressed')} style={styles.circleButton}>
          <Ionicons
            name="return-up-back-outline"
            size={30}
            color={"#000000"}
            style={{ paddingRight: 20 }}
          />
        </TouchableOpacity>

        <View style={{ paddingLeft: "13%" }}>
          <NunitoText style={{ fontSize: 20, color: "#000000", fontWeight: "bold" }}>
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
              { color: actualPage === index ? "#000000" : "#8C8C8C" }
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
                    <View style={{paddingHorizontal: 12, paddingVertical: 15}}> 
                        <CustomBook
                            key={book.id}
                            size={book.size}
                            title={book.title}
                            photoPath={book.photoPath}
                            onPress={handlePress}
                            bookId={book.id}
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
            {readingBooks.map((book) => (
                <CustomBook
                key={book.id}
                size={book.size}
                title={book.title}
                photoPath={book.photoPath}
                onPress={handlePress}
                bookId={book.id}
                />
            ))}
            </ScrollView>
        )}

        {actualPage === 2 && (
            <ScrollView
            contentContainerStyle={styles.scrollContent}
            style={{ flex: 1 }}
            nestedScrollEnabled
            >
            {toReadBooks.map((book) => (
                <CustomBook
                key={book.id}
                size={book.size}
                title={book.title}
                photoPath={book.photoPath}
                onPress={handlePress}
                bookId={book.id}
                />
            ))}
            </ScrollView>
        )}
      </View>
    </View>
  );
};

export default Library;

const styles = StyleSheet.create({
  activeTab: {
    color: '#000',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 3,
    width: 40,
  },
  container: {
    backgroundColor: "#F4F4F4",
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
