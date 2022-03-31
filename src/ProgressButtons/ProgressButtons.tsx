import React from "react";
import { ScrollView } from "react-native";
import { DownloadButton } from "./components/DownloadButton";
import { SwipeToPayButton_LayoutAnimation } from "./components/SwipeToPayButton";
import { SwipeToPay_NonComponetized } from "./components/SwipeToPay_Naive";
import { NetworkStatusButton } from "./components/NetworkStatusButton";
import { Colors, Spacing } from "../utils";

export const ProgressButtons: React.FC = () => {
  return (
    <ScrollView
      style={{
        padding: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceBackground,
      }}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <DownloadButton />
      <SwipeToPay_NonComponetized />
      <SwipeToPayButton_LayoutAnimation />
      <NetworkStatusButton />
    </ScrollView>
  );
};
