import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const WORDS = ["What's", "up", "mobile", "devs?"];
const { width, height } = Dimensions.get("window");
const SIZE = width * 0.7;

export const InterpolateScrollView: React.FC = () => {
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    const contentOffsetX = event.contentOffset.x;
    scrollX.value = contentOffsetX;
  });

  return (
    <Animated.ScrollView
      horizontal
      pagingEnabled
      scrollEventThrottle={16} // 16 = 1/60 for 60fps. We are telling ScrollView to call onScroll every 16ms
      onScroll={onScroll}
    >
      {WORDS.map((word, index) => {
        return (
          <OnboardingPage
            key={word}
            index={index}
            title={word}
            scrollX={scrollX}
          />
        );
      })}
    </Animated.ScrollView>
  );
};

const OnboardingPage = ({
  index,
  title,
  scrollX,
}: {
  index: number;
  title: string;
  scrollX: Animated.SharedValue<number>;
}) => {
  const interpolateInputRange = [
    (index - 1) * width,
    index * width,
    (index + 1) * width,
  ];

  const squareAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollX.value,
      interpolateInputRange,
      [0, 1, 0],
      Extrapolate.CLAMP
    );

    const borderRadius = interpolate(
      scrollX.value,
      interpolateInputRange,
      [0, SIZE / 2, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }],
      borderRadius,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollX.value,
      interpolateInputRange,
      [height / 2, 0, -height / 2],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      interpolateInputRange,
      [-2, 1, -2], // Setting output range to -2 instead of 0 allows the opacity to run down to 0 faster
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
      opacity,
    };
  });

  return (
    <View
      style={[
        styles.onboarding,
        { backgroundColor: `rgba(0, 0, 256, 0.${index + 2})` },
      ]}
    >
      <Animated.View style={[styles.square, squareAnimatedStyle]} />
      <Animated.Text style={[styles.text, textAnimatedStyle]}>
        {title}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  onboarding: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0,0,256,0.4)",
  },
  text: {
    position: "absolute",
    fontSize: 50,
    color: "white",
    textTransform: "uppercase",
    fontWeight: "700",
  },
});
