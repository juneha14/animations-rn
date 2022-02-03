import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, SimpleLineIcons } from "@expo/vector-icons";

export const FloatingActionButton: React.FC = () => {
  const { bottom, right } = useSafeAreaInsets();

  const open = useSharedValue(false);

  return (
    <View style={styles.container}>
      <View
        style={{
          position: "absolute",
          bottom: bottom + 20,
          right: right + 40,
          backgroundColor: "pink",
        }}
      >
        {ACTIONS.reverse().map((action, index) => {
          return (
            <ActionButton
              key={action}
              action={action}
              index={ACTIONS.length - 1 - index}
              open={open}
            />
          );
        })}
        <Pressable
          style={[styles.button, { marginBottom: 0 }]}
          onPress={() => (open.value = !open.value)}
        >
          <Ionicons name="ios-add" size={50} color={Colors.IconOnPrimary} />
        </Pressable>
      </View>
    </View>
  );
};

const Actions = {
  ball: (
    <Ionicons
      name="ios-baseball-outline"
      size={30}
      color={Colors.IconOnPrimary}
    />
  ),
  map: <Feather name="map-pin" size={30} color={Colors.IconOnPrimary} />,
  microphone: (
    <SimpleLineIcons name="microphone" size={30} color={Colors.IconOnPrimary} />
  ),
};

type ActionType = keyof typeof Actions;
const ACTIONS: ActionType[] = ["ball", "map", "microphone"];

const ActionButton = ({
  action,
  index,
  open,
}: {
  action: ActionType;
  index: number;
  open: Animated.SharedValue<boolean>;
}) => {
  const offsetY = useDerivedValue(() => {
    const initialPosition = BUTTON_RADIUS * (index + 1) + 2 * Spacing.l;
    return open.value ? 0 : 1 * initialPosition;
  });

  const delay = useDerivedValue(() => {
    return 80 * (open.value ? index : 2 - index);
  });

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withDelay(delay.value, withSpring(offsetY.value)),
        },
      ],
      opacity: withDelay(delay.value, withSpring(open.value ? 1 : 0)),
    };
  });
  return (
    <Animated.View style={[styles.button, aStyle]}>
      {Actions[action]}
    </Animated.View>
  );
};

const BUTTON_SIZE = 100;
const BUTTON_RADIUS = BUTTON_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SurfaceBackground,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    marginBottom: Spacing.l,
    backgroundColor: Colors.IconNeutral,
  },
});
