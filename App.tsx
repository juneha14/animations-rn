import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LayoutAnimations_Todos } from "./src/Fundamentals/Reanimated/LayoutAnimations";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LayoutAnimations_Todos />
    </GestureHandlerRootView>
  );
}
