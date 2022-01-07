import React, { useRef } from "react";
import { StyleSheet, View, Dimensions, ImageBackground } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from "react-native-gesture-handler";

const { width: SIZE } = Dimensions.get("window");

const Images = {
  background: require("../../../assets/tap-gesture-handler-bg.jpg"),
  heart: require("../../../assets/tap-gesture-handler-heart.png"),
};

export const TapGestureHandler_Basics: React.FC = () => {
  const doubleTapRef = useRef();

  const scale = useSharedValue(0);
  const showText = useSharedValue(false);

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

  const onDoubleTapGestureEvent =
    useAnimatedGestureHandler<TapGestureHandlerGestureEvent>({
      onActive: () => {
        scale.value = withSequence(
          withSpring(1),
          withDelay(500, withSpring(0, { overshootClamping: true }))
        );
      },
    });

  return (
    <View style={styles.container}>
      {/* 
      - waitFor property tells TapGestureHandler to wait for possible doubleTaps before processing to handle the single tap 
      - If if doesn't detect a double tap before the specified maxDelayMs (default is 500ms) then it will handle the single tap gesture
      */}
      <TapGestureHandler
        waitFor={doubleTapRef}
        onActivated={() => {
          showText.value = !showText.value;
        }}
      >
        {/* https://github.com/software-mansion/react-native-gesture-handler/issues/71 */}
        <Animated.View>
          <TapGestureHandler
            ref={doubleTapRef}
            numberOfTaps={2}
            maxDelayMs={300}
            onGestureEvent={onDoubleTapGestureEvent}
          >
            <Animated.View
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <ImageBackground style={styles.image} source={Images.background}>
                <Animated.Image
                  style={[styles.image, styles.heart, heartAnimatedStyle]}
                  source={Images.heart}
                  resizeMode="center"
                />
              </ImageBackground>
              <Animated.Text style={[styles.text, textAnimatedStyle]}>
                ⭐️⭐️️⭐⭐️⭐️
              </Animated.Text>
            </Animated.View>
          </TapGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SIZE,
    height: SIZE,
  },
  heart: {
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 35,
  },
  text: {
    fontSize: 30,
    marginTop: 30,
  },
});
