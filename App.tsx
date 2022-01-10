import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PinchGestureHandler_2 } from "./src/Fundamentals/Reanimated/GestureHandler-v2/PinchGestureHandler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler_2 />
    </GestureHandlerRootView>
  );
}
