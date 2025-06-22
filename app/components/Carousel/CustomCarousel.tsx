import React, { useRef, useState } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";

interface CarouselProps {
  data: React.ReactNode[];
  isHorizontal?: true;
}

const { width } = Dimensions.get("window");

const CustomCarousel: React.FC<CarouselProps> = ({ data, isHorizontal }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    if (isHorizontal) {
      const index = Math.round(event.nativeEvent.contentOffset.x / 120); // Approximate item width
      setCurrentIndex(index);
    }
  };

  return (
    <View style={{ paddingLeft: 18 }}>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={
          isHorizontal
            ? {
                paddingRight: 18, // Add right padding to allow scrolling to last items
              }
            : undefined
        }
        renderItem={({ item }) => (
          <View
            style={{
              marginLeft: isHorizontal ? 10 : 0,
              marginBottom: isHorizontal ? 0 : 10,
            }}
          >
            {item}
          </View>
        )}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default CustomCarousel;
