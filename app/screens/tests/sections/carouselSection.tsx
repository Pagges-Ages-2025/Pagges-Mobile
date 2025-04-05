import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Section from "../components/section";
import CustomBook from "../../../components/Book/CustomBook"; 
import CustomCarousel from "../../../components/Carousel/CustomCarousel";

const { width } = Dimensions.get("window");

const CarouselSection = () => {
  const [open, setOpen] = useState({
    carousel: false,
    horizontal: true,
    vertical: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  const mockBooks = Array.from({ length: 5 }, (_, i) => (
    <CustomBook key={i} size="medium" photoPath={""} />
  ));

  return (
    <Section
      title="Carrossel"
      isOpen={open.carousel}
      onToggle={() => toggle("carousel")}
      type="title"
    >
      <Section
        title="Carrossel horizontal (isHorizontal)"
        isOpen={open.horizontal}
        onToggle={() => toggle("horizontal")}
      >
        <View style={styles.carouselWrapper}>
          <CustomCarousel data={mockBooks} isHorizontal />
        </View>
      </Section>
      <Section
        title="Carrossel vertical *(normal)*"
        isOpen={open.vertical}
        onToggle={() => toggle("vertical")}
      >
        <View style={styles.carouselWrapper}>
          <CustomCarousel data={mockBooks} />
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  carouselWrapper: {
    width: width,
    paddingVertical: 16,
  },
});

export default CarouselSection;
