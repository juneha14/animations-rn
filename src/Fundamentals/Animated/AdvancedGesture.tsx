/* 
# Pan Gesture Responder

- Pan responder reconciles several touches into a single gesture 
    - i.e. it allows us to use multi-touch out of the box without too much hassle 

- It is a wrapper around the basic view responder events

- Under the hood, pan responder creates the classic view gesture handlers, but include additional state information 
    - Gesture state contains: 
        - x0, y0: represents the original position of the first touch event (i.e. the touch position that started the gesture)
        - moveX, moveY: represents the latest screen coordinates of the current touch on the screen 
        - dx, dy: similar to moveX, moveY, but is relative to the original touch event (i.e. the distance between the origin point and the latest touch position)
        - vx, vy: represents the current velocity of the gesture
    - Gesture state is created after a touch begins, and is continually updated as the gesture is updated by the user
*/

import React, { useRef } from "react";
import {
  Animated,
  PanResponder,
  useWindowDimensions,
  View,
} from "react-native";

const IMAGE_URI =
  "https://vignette.wikia.nocookie.net/joke-battles/images/4/40/18360-doge-doge-simple.jpg/revision/latest?cb=20151209161638";

/**
 * Computes the scaling factor between two touches
 * Scale up when distance between touches increases
 * Scale down when distance between touches decreases
 */
const pointsDistance = ([xA, yA]: number[], [xB, yB]: number[]) => {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
};

export const AdvancedGesture_PanAndScaleImage: React.FC = () => {
  const dimensions = useWindowDimensions();

  // Stores the current touch position so that the image position can follow our touch
  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  // Stores the image scaling factor. 1 by default shows original unscaled size
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // More accurate than gestureState.numberActiveTouches
        // https://github.com/facebook/react-native/blob/8a31dfe567a22dbc018ea763b0a9706068276c4a/Libraries/Interaction/PanResponder.js#L383-L384
        const activeTouches = event.nativeEvent.changedTouches.length;

        if (activeTouches === 1) {
          pan.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        } else if (activeTouches >= 2) {
          const touches = event.nativeEvent.changedTouches;

          const touchA = touches[0];
          const touchB = touches[1];

          const distance = pointsDistance(
            [touchA.pageX, touchA.pageY],
            [touchB.pageX, touchB.pageY]
          );

          // Idea is that if we pinch our fingers half the screen's width, then image should scale by 50%
          const screenMovedPercents = distance / dimensions.width;

          // Add to base 1 so that if we pinchh 50%, then we want our scaling factor to be 1.5
          scale.setValue(1 + screenMovedPercents);
        }
      },
      onPanResponderRelease: () => {
        Animated.parallel([
          Animated.spring(pan, {
            toValue: {
              x: 0,
              y: 0,
            },
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      },
    })
  ).current;

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Animated.Image
        {...panResponder.panHandlers} // Need to spread the pan gesture props so that the view can handle gestures. This allows us to separate the gesture logic from the view component logic/properties
        source={{ uri: IMAGE_URI }}
        style={{
          height: 200,
          width: 300,
          borderRadius: 10,
          transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale }],
        }}
      />
    </View>
  );
};
