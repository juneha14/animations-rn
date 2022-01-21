import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheet } from "./src/BottomSheet/BottomSheet";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheet />
    </GestureHandlerRootView>
  );
}
