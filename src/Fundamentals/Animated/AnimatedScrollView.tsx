/* 
Idea: We have a long ScrollView component with a header:
    - Whenever we scroll down to a certain point, header disappears
    - Whenever we scroll up again, the header reappears
*/

import React, { useEffect, useRef, useState } from "react";
import { Animated, ScrollView, View } from "react-native";

/* 
There exists a performance issue with this state-based useEffect approach:
    - useState relies on communicating with the JS thread to run our animations 
    - If we can avoid useState, then this means that animations can happen solely on the UI thread 
*/
export const AnimatedScrollView_Naive: React.FC = () => {
  const [headerShown, setHeaderShown] = useState(true);
  const translationY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translationY, {
      toValue: headerShown ? 0 : -100,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [headerShown, translationY]);

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          zIndex: 100,
          backgroundColor: "tomato",
          transform: [{ translateY: translationY }],
        }}
      />

      <ScrollView
        onScroll={(event) => {
          const scrolling = event.nativeEvent.contentOffset.y;

          if (scrolling > 100) {
            setHeaderShown(false);
          } else {
            setHeaderShown(true);
          }
        }}
        // onScroll will be fired every 16ms
        scrollEventThrottle={16}
        style={{ flex: 1, backgroundColor: "pink" }}
      >
        <View style={{ flex: 1, height: 5000 }} />
      </ScrollView>
    </>
  );
};

/*
- Solution - Animated.event:
    - We can remove the need for state by storing the vertical scroll value as an animated value
    - Then we can interpolate this value to either -100 when we are below 100 pixels, or 0 otherwise 
    - Major difference now is that we will keep track of the scrolling value at any given time, and then determine whether to show the header based off of its value

- 3 key things to take-away:
    1) onScroll gives us information on the current scrolling position and other indicators (contentOffset, contentInset, contentSize, etc.)
    2) To change an animated value based on a scrolling event, use the Animated.event with onScroll 
    3) It requires a mapping of the event with the corresponding animated values, that will be changed on the UI thread whenever the event is fired
*/
export const AnimatedScrollView_Optimized: React.FC = () => {
  const scrolling = useRef(new Animated.Value(0)).current;

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          zIndex: 100,
          backgroundColor: "tomato",
          transform: [
            {
              translateY: scrolling.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -100],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      />

      <Animated.ScrollView
        /*
        - When we scroll, we want to update our scrolling Animated.Value
        - Animated.event is a helper function that maps an animated value to a native event value (e.g. scrolling content offset)
        - We can see this as a destructuring of the event object (that is usually passed through the onScroll callback)
        - We then map the scrolling animated value to the nativeEvent.contentOffset.y event value
        - Under the hood, Animated calls setValue on the Animated.Value whenever a native event is fired:
            onScroll={(event) => {
                // Done in an optimzed way on the UI thread. This is what is being done by Animated automatically for you under the hood
                scrolling.setValue(event.nativeEvent.contentOffset.y)
            }}
        */
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrolling } } }],
          { useNativeDriver: true }
        )}
        style={{ flex: 1, backgroundColor: "pink" }}
      >
        <View style={{ flex: 1, height: 5000 }} />
      </Animated.ScrollView>
    </>
  );
};
