import Strings from "@/app/constants/Strings";
import { useTheme } from "@/app/context/ThemeContext";
import SearchAPI from "@/app/services/googleAPIService";
import { registerBookInDatabase } from "@/app/services/handle-select-book.service";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomBook from "../Book/CustomBook";
import BookSearch, { Book } from "../SearchBar/SearchBar";
import NunitoText from "../Texts/NunitoText";

// Interface estendida para suportar ambos os formatos de livro
interface ExtendedBook extends Book {
  title?: string;
  google_image_url?: string;
}

interface SelectBookProps {
  onSelectBook: (book: ExtendedBook) => void;
  initialBook?: ExtendedBook | null;
}

const SelectBook = forwardRef(
  ({ onSelectBook, initialBook }: SelectBookProps, ref) => {
    const { theme, themeName } = useTheme();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [buttonVisible, setButtonVisible] = useState(true);
    const { height: SCREEN_HEIGHT } = Dimensions.get("window");
    const snapPoints = useMemo(() => [SCREEN_HEIGHT * 0.6], []);
    const [loading, setLoading] = useState(false);
    const { searchBooks } = SearchAPI();
    const [books, setBooks] = useState<ExtendedBook[]>([]);
    const [selectedBook, setSelectedBook] = useState<ExtendedBook | null>(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    // Utiliza o livro inicial quando disponível
    useEffect(() => {
      if (initialBook) {
        setSelectedBook(initialBook);
      }
    }, [initialBook]);

    const handleOpen = () => {
      setIsBottomSheetOpen(true);
      bottomSheetRef.current?.expand();
      setButtonVisible(false);
    };

    const handleCloseBottomSheet = () => {
      setButtonVisible(true);
    };

    const handleSelectBook = (book: ExtendedBook) => {
      registerBookInDatabase(book as Book);
      setSelectedBook(book);
      setButtonVisible(true);
      bottomSheetRef.current?.close();
      onSelectBook && onSelectBook(book);
    };

    const handleSearch = async (term: string) => {
      setLoading(true);
      try {
        const results = await searchBooks(term);
        setBooks(results as ExtendedBook[]);
      } catch (error) {
        console.error("Erro ao buscar livros:", error);
      } finally {
        setLoading(false);
      }
    };

    // Função para obter o título do livro independente da estrutura
    const getBookTitle = (book: ExtendedBook) => {
      return book.titulo || book.title || "";
    };

    // Função para obter a capa do livro independente da estrutura
    const getBookCover = (book: ExtendedBook) => {
      return book.capa || book.google_image_url || "";
    };

    return (
      <>
        <GestureHandlerRootView
          style={[styles.container, { backgroundColor: theme.Background }]}
        >
          <BottomSheet
            style={{ backgroundColor: theme.Background }}
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
            <BottomSheetScrollView
              style={{ backgroundColor: theme.Background }}
            >
              <View
                style={[styles.search, { backgroundColor: theme.Background }]}
              >
                {isBottomSheetOpen && (
                  <View>
                    <BookSearch
                      SearchSize="md"
                      iconPosition="left"
                      iconColor="grey"
                      borderRadius="md"
                      books={books as Book[]}
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
                      <NunitoText
                        style={{ textAlign: "center", marginTop: 20 }}
                      >
                        {Strings.noBooks}
                      </NunitoText>
                    ) : (
                      books.map((item, index) => (
                        <CustomBook
                          key={item.id ?? index}
                          size="search"
                          title={getBookTitle(item)}
                          photoPath={getBookCover(item)}
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
          <View style={{ backgroundColor: theme.Background }}>
            {selectedBook ? (
              <CustomBook
                size="search"
                title={getBookTitle(selectedBook)}
                photoPath={getBookCover(selectedBook)}
                bookId={selectedBook.id}
                onPress={handleOpen}
              />
            ) : (
              <TouchableOpacity
                onPress={handleOpen}
                style={styles.searchBarButton}
              >
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
  }
);

export default SelectBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomSheet: {
    borderRadius: 0,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  searchBarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  search: {
    width: "100%",
    paddingBottom: 10,
    alignSelf: "center",
  },
});
