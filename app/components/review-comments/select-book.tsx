import { View, StyleSheet, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRef, useMemo, forwardRef, useState } from 'react';
import Strings from '@/app/constants/Strings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NunitoText from '../Texts/NunitoText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/context/ThemeContext';
import BookSearch, { Book } from '../SearchBar/SearchBar';
import SearchAPI from '@/app/services/googleAPIService';
import ModalBookDetails from '@/app/screens/book';
import React from 'react';
import CustomBook from '../Book/CustomBook';

const SelectBook = forwardRef((props, ref) => {

  const { theme, themeName } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.6], []);
  const [loading, setLoading] = useState(false);
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleOpen = () => {
    setIsBottomSheetOpen(true);
    bottomSheetRef.current?.expand();
    setButtonVisible(false); 
  };

  const handleCloseBottomSheet = () => {
    setButtonVisible(true); 
  }

  const handleSelectBook = (book: Book) => {
    console.log("Livro selecionado:", book);
    let updatedCapa = book.capa;
    if (updatedCapa && updatedCapa.includes('zoom=1')) {
      updatedCapa = updatedCapa.replace('zoom=1', 'zoom=6');
    }

    setSelectedBook({ ...book, capa: updatedCapa });
    setButtonVisible(true);
    bottomSheetRef.current?.close();
  };
  
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

  return (
    <>
      <GestureHandlerRootView style={[styles.container, { backgroundColor: theme.Background }]}>
        <BottomSheet
        style={{backgroundColor: theme.Background}}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          index={-1} 
          backgroundStyle={styles.bottomSheet}
          onClose={handleCloseBottomSheet}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1} 
              appearsOnIndex={0}     
              opacity={0.2}          
            />
          )}
        >
          <BottomSheetScrollView style={{backgroundColor: theme.Background}}>
            <View style={[styles.search, {backgroundColor: theme.Background}]}>
              {isBottomSheetOpen && (
                <View>
                  <BookSearch
                    SearchSize="md"
                    iconPosition="left"
                    iconColor="grey"
                    borderRadius="md"
                    books={books}
                    onSelectBook={handleSelectBook} 
                    onSearch={handleSearch}
                    isBottomSheet={true}
                  />

                  {loading ? (
                    <ActivityIndicator
                      size="small"
                      color="#000"
                      style={{ marginLeft: 10, marginTop: 20 }}
                    />
                  ) : books.length === 0 ? (
                    <NunitoText style={{ textAlign: 'center', marginTop: 20 }}>
                      {Strings.noBooks}
                    </NunitoText>
                  ) : (
                    books.map((item, index) => (
                      <CustomBook
                        key={item.id ?? index} 
                        size="search"
                        title={item.titulo}
                        photoPath={item.capa}
                        bookId={item.id}
                        onPress={() => handleSelectBook(item)}
                      />
                    ))
                  )}
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
            
      {buttonVisible && (
        <View style={[styles.selectText, { backgroundColor: theme.Background }]}>
          {selectedBook ? (
            <CustomBook
              size="search"
              title={selectedBook.titulo}
              photoPath={selectedBook.capa}
              bookId={selectedBook.id}
              onPress={handleOpen}
            />
          ) : (
          <TouchableOpacity onPress={handleOpen} style={styles.selectButton}>
            <NunitoText
              style={{
                color: theme.quinaryText,
                fontSize: 17,
              }}
            >
              {Strings.selectBook}
            </NunitoText>
            <Ionicons
              name="chevron-up-outline"
              size={20}
              color={theme.quinaryText}
              style={{ marginLeft: 15 }}
            />
          </TouchableOpacity>
      )}
  </View>
)}
    </>
  );
});

export default SelectBook;

const styles = StyleSheet.create({
  container:{
    flex: 1,
  },
  bottomSheet: {
    borderRadius: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  selectText: {
    padding: 10
  },
  selectButton: {
    flexDirection: "row", 
    alignItems: "center", 
  },
  search:{
    width:"90%",
    alignSelf: 'center',
  }
});
