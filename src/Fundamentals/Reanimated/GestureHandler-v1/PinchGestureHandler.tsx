import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const IMAGE_URI =
  "https://images.unsplash.com/photo-1621569642780-4864752e847e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=668&q=80";

const { width, height } = Dimensions.get("window");

export const PinchGestureHandler_Basics: React.FC = () => {
  const scale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const onPinchGestureEvent =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onActive: (event) => {
        focalX.value = event.focalX;
        focalY.value = event.focalY;
        scale.value = event.scale;
      },
      onEnd: () => {
        scale.value = withTiming(1);
      },
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        /* 
        - Remember that translations are based off of the view's origin (i.e. x0,y0 at the top-left)
        - If we simply translate a value using the focalXY points, then this would translate the view's origin to the focal points
        - We need to offset this somehow so that the view translates based on the focal point and not its origin
        - To do this, we need to subtract the width/2 and height/2
            - To visualize this, say that we are trying to translate the dead-center of the view. In this case, we don't want 
              any translation to take place (i.e. translation = 0). To do this, we would need to subtract the width/2 and height/2
        */
        { translateX: -width / 2 },
        { translateY: -height / 2 },

        { scale: scale.value },

        /* 
        - The order of transform execution in the array matters
        - Here, after we translate to the correct origin point, we scale the image
        - After scaling, we 'reset' the translations. The previous translations were simply so that we can scale the correct origin
        */
        { translateX: -focalX.value },
        { translateY: -focalY.value },
        { translateX: width / 2 },
        { translateY: height / 2 },
      ],
    };
  });

  return (
    <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
      <Animated.View style={{ flex: 1 }}>
        <Animated.Image
          style={[styles.image, animatedStyle]}
          source={{ uri: IMAGE_URI }}
        />
      </Animated.View>
    </PinchGestureHandler>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});
