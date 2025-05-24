import React, { useEffect, useRef } from "react";
import { View, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";

interface CarouselProps {
  data: React.ReactNode[];
  isHorizontal?: true;
  onIndexChange?: (index: number) => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width * 0.9;
const itemSpacing = 5;

const CustomHomeCarousel: React.FC<CarouselProps> = ({ data, isHorizontal, onIndexChange }) => {
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (cardWidth + itemSpacing));
    currentIndexRef.current = index;

    if (onIndexChange) onIndexChange(index);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: 0,
        animated: false,
        viewPosition: 0.5,
      });
    }, 0);
  }, []);

  return (
    <View>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + itemSpacing}
        decelerationRate="fast"
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{
          paddingHorizontal: (width - cardWidth) / 2,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: cardWidth,
              marginHorizontal: itemSpacing / 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item}
          </View>
        )}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default CustomHomeCarousel;
