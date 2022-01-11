import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TapGestureHandler_2 } from "./src/Fundamentals/Reanimated/GestureHandler-v2/TapGestureHandler";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TapGestureHandler_2 />
    </GestureHandlerRootView>
  );
}
