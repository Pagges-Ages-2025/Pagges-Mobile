import React, { useRef, useState } from "react";
import { View, StyleSheet } from "react-native";
import Section from "../components/section";
// import LottieView from "lottie-react-native";

const AnimationSection = () => {
  const [open, setOpen] = useState({
    animations: false,
    loading: true,
    login: true,
  });

  const toggle = (key: keyof typeof open) =>
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));

  // const lottieRef = useRef<LottieView>(null);

  return (
    <Section
      title="Animações"
      isOpen={open.animations}
      onToggle={() => toggle("animations")}
      type="title"
    >
      <Section
        title="Loading"
        isOpen={open.loading}
        onToggle={() => toggle("loading")}
      >
        <View style={styles.grid}>
          {/* <LottieView
            ref={lottieRef}
            source={require("../../../assets/animations/bookLoading.json")}
            style={styles.lottie}
            autoPlay={true}
            loop={true}
          /> */}
        </View>
      </Section>
      <Section
        title="Tela de Login"
        isOpen={open.login}
        onToggle={() => toggle("login")}
      >
        <View style={styles.grid}>
          {/* <LottieView
            ref={lottieRef}
            source={require("../../../assets/animations/login.json")}
            style={styles.lottie}
            autoPlay={true}
            loop={true}
          /> */}
        </View>
      </Section>
    </Section>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "flex-start",
  },
  lottie: {
    alignSelf: "center",
    height: 300,
    width: 300,
  },
});

export default AnimationSection;
