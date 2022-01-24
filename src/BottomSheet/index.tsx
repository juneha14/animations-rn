import React, { useState } from "react";
import { Text, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import { BottomSheet, FULLY_CLOSED, PREVIEW } from "./BottomSheet";

const Screen: React.FC = () => {
  const [open, setOpen] = useState(false);
  const progressOffset = useSharedValue(0);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progressOffset.value,
      [FULLY_CLOSED, PREVIEW],
      [1, 0.2],
      Extrapolate.CLAMP
    );
    return {
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={containerAnimatedStyle}>
        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text>Open Bottom Sheet</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={() => setOpen(false)}>
          <Text>Close Bottom Sheet</Text>
        </Pressable>
      </Animated.View>
      <BottomSheet
        open={open}
        onDismissSheet={() => setOpen(false)}
        onUpdateOffsetY={(offsetY) => (progressOffset.value = offsetY.value)}
      />
    </View>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SurfaceBackground,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    margin: Spacing.s,
    padding: Spacing.m,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.Border,
  },
});
