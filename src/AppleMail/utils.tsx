import React from "react";
import { View, Dimensions } from "react-native";
import { Colors, Spacing } from "../utils";

const { width } = Dimensions.get("window");
export const SNAP_POINTS = [0, -80, -width];
export const THRESHOLD = SNAP_POINTS[2] + Spacing.xl + 30;
export const SEARCH_BAR_HEIGHT = 38;

export const Divider = () => {
  return (
    <View
      style={{
        height: 1,
        marginLeft: Spacing.xl,
        backgroundColor: Colors.BorderSubdued,
      }}
    />
  );
};
