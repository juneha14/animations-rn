import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const IMAGE_URI =
  "https://i.picsum.photos/id/1/5616/3744.jpg?hmac=kKHwwU8s46oNettHKwJ24qOlIAsWN9d2TtsXDoCWWsQ";
const { width, height } = Dimensions.get("window");

export const PinchGestureHandler_2: React.FC = () => {
  const panOffset = useSharedValue({ x: 0, y: 0 });
  const panStart = useSharedValue({ x: 0, y: 0 });

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const focalPoint = useSharedValue({ x: 0, y: 0 });

  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalPoint.value.x - width / 2 },
        { translateY: focalPoint.value.y - height / 2 },
        { scale: scale.value },
        { translateX: -focalPoint.value.x + width / 2 },
        { translateY: -focalPoint.value.y + height / 2 },

        // { translateX: panOffset.value.x },
        // { translateY: panOffset.value.y },
        // { rotateZ: `${rotation.value}rad` },
      ],
    };
  });

  const pan = Gesture.Pan()
    .averageTouches(true)
    .onStart(() => {
      panStart.value = {
        x: panOffset.value.x,
        y: panOffset.value.y,
      };
    })
    .onUpdate((e) => {
      panOffset.value = {
        x: e.translationX + panStart.value.x,
        y: e.translationY + panStart.value.y,
      };
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      focalPoint.value = {
        x: e.focalX,
        y: e.focalY,
      };

      const targetScale = e.scale * savedScale.value;
      if (targetScale >= 1) {
        scale.value = targetScale;
      }
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotate = Gesture.Rotation()
    .onUpdate((e) => {
      rotation.value = e.rotation + savedRotation.value;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(
    pan,
    Gesture.Simultaneous(pinch, rotate)
  );

  return (
    <View style={styles.container}>
      <GestureDetector gesture={composed}>
        <Animated.Image
          style={[{ flex: 1, width }, imageAnimatedStyle]}
          source={{ uri: IMAGE_URI }}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
