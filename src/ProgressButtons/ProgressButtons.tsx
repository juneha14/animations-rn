import React from "react";
import { View } from "react-native";
import { Download } from "./components/Download";
import { SwipeToPay_LayoutAnimation } from "./components/SwipeToPay";
import { SwipeToPay_NonComponetized } from "./components/SwipeToPay_Naive";
import { Colors, Spacing } from "../utils";

export const ProgressButtons: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      <Download />
      <SwipeToPay_NonComponetized />
      <SwipeToPay_LayoutAnimation />
    </View>
  );
};
