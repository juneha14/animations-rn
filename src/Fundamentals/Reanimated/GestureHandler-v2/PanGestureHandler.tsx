import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const CIRCLE_SIZE = Dimensions.get("window").width * 0.8;
const SQUARE_SIZE = 80;

export const PanGestureHandler_2: React.FC = () => {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  // Remember that we need to store the position of the pannable item at the moment we grab it
  // in order to be able to correctly position it later. This is because we only have access to
  // translation values RELATIVE to the starting point of the gesture.
  const startPosition = useSharedValue({ x: 0, y: 0 });

  const pannableAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: offsetX.value,
        },
        {
          translateY: offsetY.value,
        },
      ],
    };
  });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .onStart(() => {
      startPosition.value = {
        x: offsetX.value,
        y: offsetY.value,
      };
    })
    .onUpdate((e) => {
      offsetX.value = e.translationX + startPosition.value.x;
      offsetY.value = e.translationY + startPosition.value.y;
    })
    .onEnd(() => {
      const distanceFromOrigin = Math.sqrt(
        offsetX.value ** 2 + offsetY.value ** 2
      );

      if (distanceFromOrigin > CIRCLE_SIZE / 2 + SQUARE_SIZE / 2) {
        // Outside the circle, so spring back to middle origin
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
      }
    });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.pannable, pannableAnimatedStyle]} />
        </GestureDetector>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: CIRCLE_SIZE / 2,
    borderColor: "black",
    borderWidth: 5,
  },
  pannable: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 10,
    backgroundColor: "indigo",
  },
});
