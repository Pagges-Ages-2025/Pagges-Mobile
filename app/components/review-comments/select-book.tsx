import { View, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useRef, useMemo, forwardRef, useCallback, useState } from 'react';
import Strings from '@/app/constants/Strings';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NunitoText from '../Texts/NunitoText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/app/context/ThemeContext';
import BookSearch, { Book } from '../SearchBar/SearchBar';
import SearchAPI from '@/app/services/googleAPIService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const SelectBook = forwardRef((props, ref) => {

  const { theme, themeName } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [buttonVisible, setButtonVisible] = useState(true);
  const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.6], []);
  const [loading, setLoading] = useState(false);
  const { searchBooks } = SearchAPI();
  const [books, setBooks] = useState<Book[]>([]);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.expand();
    bottomSheetRef.current?.close();
    
    setButtonVisible(false); 
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    setButtonVisible(true); 
  }, []);

  const handleSelectBook = (book: Book) => {
    console.log("Livro selecionado:", book);
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
          <BookSearch
              SearchSize="md"
              iconPosition="left"
              iconColor="grey"
              borderRadius="md"
              books={books}
              onSelectBook={handleSelectBook} 
              onSearch={handleSearch}
            />
          <NunitoText>Buscar livros e exibir (nova task)</NunitoText>
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
});
