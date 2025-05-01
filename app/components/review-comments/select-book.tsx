import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

const SelectBook = forwardRef((props, ref) => {

  const { theme, themeName } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.6], []);
  const [loading, setLoading] = useState(false);
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleOpen = () => {
    setIsBottomSheetOpen(true)
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
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
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
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          index={-1} 
          backgroundStyle={styles.bottomSheet}
          onClose={handleCloseBottomSheet}
          
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1} 
              appearsOnIndex={0}     
              opacity={0.2}          
            />
          )}
        >
          <BottomSheetScrollView>
            <View style={styles.search}>
            {isBottomSheetOpen && (

              <BookSearch
                SearchSize="md"
                iconPosition="left"
                iconColor="grey"
                borderRadius="md"
                books={books}
                onSelectBook={handleSelectBook} 
                onSearch={handleSearch}
              />
            )}
            </View>
            {selectedBook && (
              <ModalBookDetails
                visible={modalVisible}
                onClose={handleCloseModal}
                titulo={selectedBook.titulo}
                author={selectedBook.autores?.join(", ") || "Autor desconhecido"}
                capa={selectedBook.capa}  
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
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>

      {buttonVisible && (
        <View style={[styles.selectText, { backgroundColor: theme.Background }]}>
          <TouchableOpacity onPress={handleOpen} style={styles.selectButton}>
          <NunitoText style={{
            color: themeName === "dark" ? theme.primaryText : theme.secondaryText,
            fontSize: 17,
          }}>
            {Strings.selectBook}
          </NunitoText>
          <Ionicons 
            name="chevron-up-outline" 
            size={20} 
            color={themeName === "dark" ? theme.primaryText : theme.secondaryText}
            style={{ marginLeft: 15 }}
          />
        </TouchableOpacity>
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
