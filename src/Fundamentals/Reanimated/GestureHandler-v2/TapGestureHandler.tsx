import React from "react";
import { Dimensions, ImageBackground, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const Images = {
  background: require("../../../../assets/tap-gesture-handler-bg.jpg"),
  heart: require("../../../../assets/tap-gesture-handler-heart.png"),
};

export const TapGestureHandler_2: React.FC = () => {
  const scale = useSharedValue(0); // Initially heart is hidden
  const showText = useSharedValue(false);

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      showText.value = !showText.value;
    });

  const doubleTap = Gesture.Tap()
    .maxDelay(200)
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withSequence(
        withSpring(1),
        withDelay(300, withSpring(0, { overshootClamping: true }))
      );
    });

  // There seems to be a bug where this Exclusive is not recognizing doubleTap as the priority
  // Only singleTap gestures are being recognized
  // Note: if we change singleTap to be longPress, then this exclusive seems to work
  const tapGestures = Gesture.Exclusive(doubleTap, singleTap);

  return (
    <View style={styles.container}>
      <GestureDetector gesture={tapGestures}>
        <Content scale={scale} showText={showText} />
      </GestureDetector>
    </View>
  );
};

const Content = ({
  scale,
  showText,
}: {
  scale: Animated.SharedValue<number>;
  showText: Animated.SharedValue<boolean>;
}) => {
  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
      ],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(showText.value ? 1 : 0),
    };
  });

  return (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
      <ImageBackground style={styles.image} source={Images.background}>
        <Animated.Image
          style={[styles.heart, heartAnimatedStyle]}
          source={Images.heart}
          resizeMode="center"
        />
      </ImageBackground>
      <Animated.Text style={textAnimatedStyle}>⭐️⭐️⭐️⭐️⭐</Animated.Text>
    </View>
  );
};

const IMG_SIZE = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: IMG_SIZE,
    height: IMG_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  heart: {
    width: 100,
    height: 100,
  },
});
