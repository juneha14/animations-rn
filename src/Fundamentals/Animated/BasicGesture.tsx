/*
# Responders

- Imagine our application has a guy that is responsible for handling gestures:
    - Whenever we press something, we first need to ask him for permission to handle the gesture 
    - Only one gesture can be asked/granted at a time 
    - Let's call this guy the "gesture responder"

- For example, if a button wants to be pressable, it needs to let the gesture responder know that if a user touches it, no matter what other movement they do, this button only should be pressed
- In other words, whenever you interact with a view in your app, you need to let the gesture responder know which element should become interactive and how
    - This layer is usually abstracted for us with components such as button, touchables, pressables, etc.


# Responder Lifecycle 

- Every RN view can become interactive the way you want it to be 
    - You simply need to let the gesture responder know how it should deal with a gesture happening inside that view 

- A gesture always starts with a touch, then you move it around, and eventually you release the touch
    - A start event, a series of move events, a release event 

- Every RN view can keep track of gestures, meaning that a view can ask the gesture responder to act in a certain way when it is interacted
    - `onStartShouldSetResponder` and `onMoveShouldSetResponder` define if a View should be talking to the responder and then becomes interactive 
        - onStartShouldSetResponder: set this to true if you want to tell the gesture responder that a view should become interactive
        - onMoveShouldSetResponder: Called for every touch move on the View when it is not the responder. Does this view want to claim touch responsiveness?

- `onResponderMove`: Triggered with events whenever a user's touch is moving on the screen. This tells the gesture responder how the view's gesture should work
- `onResponderRelease`: Fired at the end of a gesture touch/movement

<View 
    onStartShouldSetResponder={}
    onMoveShouldSetResponder={}
    onResponderMove={}
    onResponderRelease={}
/>

- These properties are useful to define side-effects based on a gesture (i.e. when it should start, how it should move, when it should end)
*/

import React, { useRef } from "react";
import { Animated, useWindowDimensions, View } from "react-native";

const CURSOR_SIZE = 20;
const CURSOR_RADIUS = CURSOR_SIZE / 2;

export const BasicGesture: React.FC = () => {
  // Since cursor will be moved on both x and y axis, create an XY animated value to store the current position
  const touch = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const dimensions = useWindowDimensions();

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={() => true} // This tells our gesture responder that this parent view should receive all the move events happening on this part of the screen. In other words, we are asking for this view to become the touch responder to start events
      onResponderMove={(event) => {
        /* 
        - Update our animated value to store the current touch position whenever the touch gesture moves 
        - `event` contains some info on the current touch:
            - pageX: the X position of the touch, relative to the root element 
            - pageY: the Y position of the touch, relative to the root element 
            - locationX: the X position of the touch, relative to the element
            - locationY: the Y position of the touch, relative to the element

        - locationX and locationY are useful to us - these correspond to the current finger position on both axes relative to our View component
        */

        touch.setValue({
          x: event.nativeEvent.locationX,
          y: event.nativeEvent.locationY,
        });
      }}
      onResponderRelease={() => {
        Animated.spring(touch, {
          toValue: {
            x: dimensions.width / 2 - CURSOR_RADIUS,
            y: dimensions.height / 2 - CURSOR_RADIUS,
          },
          useNativeDriver: false,
        }).start();
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          left: Animated.subtract(touch.x, CURSOR_RADIUS), // This is so that the cursor is centered with the touch start
          top: Animated.subtract(touch.y, CURSOR_RADIUS), // Remember, we can NOT manipulate animated values like: touch.x - CURSOR_RADIUS. Instead, we need to use Animated operators
          height: CURSOR_SIZE,
          width: CURSOR_SIZE,
          borderRadius: CURSOR_RADIUS,
          backgroundColor: "orange",
        }}
      />
    </View>
  );
};
