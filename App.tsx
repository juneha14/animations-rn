import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Accordion } from "./src/Accordion/Accordion";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Accordion />
    </GestureHandlerRootView>
  );
}
