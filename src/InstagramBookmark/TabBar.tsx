import React, { Ref, useImperativeHandle } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../utils";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabBarProps {
  ref: Ref<TabBarRef>;
}

export interface TabBarRef {
  wiggleUser: () => void;
}

export const TabBar: React.FC<TabBarProps> = React.forwardRef((props, ref) => {
  const { bottom } = useSafeAreaInsets();

  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  useImperativeHandle(ref, () => {
    return {
      wiggleUser: () => {
        "worklet";
        scale.value = withSequence(
          withTiming(1.5, { duration: 150 }),
          withTiming(1, { duration: 150 }, () => {
            rotateZ.value = withSequence(
              withTiming(-10, { duration: 100 }),
              withTiming(10, { duration: 100 }),
              withTiming(0, { duration: 100 })
            );
          })
        );
      },
    };
  });

  const userTabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotateZ: `${rotateZ.value}deg` }],
    };
  });

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: bottom,
        backgroundColor: Colors.SurfaceBackgroundPressed,
        zIndex: 2, // Makes the TabBar appear on top of the BookmarkPreview component
      }}
    >
      <Ionicons name="ios-home-outline" size={24} color="black" />
      <Ionicons name="search-outline" size={24} color="black" />
      <MaterialCommunityIcons name="movie-roll" size={24} color="black" />
      <MaterialCommunityIcons name="shopping-outline" size={24} color="black" />

      <Animated.View style={userTabAnimatedStyle}>
        <Ionicons name="person-circle-outline" size={24} color="black" />
      </Animated.View>
    </View>
  );
});
