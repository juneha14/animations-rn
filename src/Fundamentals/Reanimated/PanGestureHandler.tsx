import React from "react";
import { View, StyleSheet } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const SIZE = 100;
const CIRCLE_RADIUS = SIZE * 2;

// We can think of Context as being an object that can store some information about the gesture, and retrieve at a later time
type Context = {
  touchX: number;
  touchY: number;
};

export const PanGestureHandler_Basics: React.FC = () => {
  const touchX = useSharedValue(0);
  const touchY = useSharedValue(0);

  // With useAnimatedGestureHandler, we can handle gestures other than PanGestureHandler (e.g. PinchGestureHandler)
  // You can specify the gesture type to get the typed event
  const onPanGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    Context
  >({
    onStart: (event, context) => {
      // Store previous touchXY values in context
      context.touchX = touchX.value;
      context.touchY = touchY.value;
    },
    onActive: (event, context) => {
      // Need to add previous touchXY values (retrieved from context) since translation animation starts from origin 0 point
      touchX.value = event.translationX + context.touchX;
      touchY.value = event.translationY + context.touchY;
    },
    onEnd: () => {
      const distance = Math.sqrt(touchX.value ** 2 + touchY.value ** 2);
      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        touchX.value = withSpring(0);
        touchY.value = withSpring(0);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: touchX.value }, { translateY: touchY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <Animated.View style={[styles.square, animatedStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0,0,256, 0.5)",
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: CIRCLE_RADIUS,
    borderColor: "black",
    borderWidth: 5,
  },
});
