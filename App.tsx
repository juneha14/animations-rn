import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PanGestureHandler_2 } from "./src/Fundamentals/Reanimated/GestureHandler-2.0/PanGestureHandler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PanGestureHandler_2 />
    </GestureHandlerRootView>
  );
}
