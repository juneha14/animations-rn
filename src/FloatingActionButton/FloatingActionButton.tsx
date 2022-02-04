import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, Feather, SimpleLineIcons } from "@expo/vector-icons";

export const FloatingActionButton: React.FC = () => {
  const { bottom, right } = useSafeAreaInsets();

  const open = useSharedValue(false);

  return (
    <>
      <Animated.View style={[styles.container]} />
      <View
        style={{
          position: "absolute",
          bottom: bottom + 20,
          right: right + 40,
        }}
      >
        {ACTIONS.reverse().map((action, index) => {
          return (
            <ActionButton
              key={action}
              action={action}
              index={ACTIONS.length - 1 - index} // React lays out components top-bottom. But we want the bottom button to have 0 index
              open={open}
            />
          );
        })}
        <ToggleButton open={open} />
      </View>
    </>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const ToggleButton = ({ open }: { open: Animated.SharedValue<boolean> }) => {
  const progress = useDerivedValue(() => {
    return withSpring(open.value ? 1 : 0);
  });

  const buttonContainerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 0.5, 1], [1, 0.2, 1]);
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.IconInteractive, Colors.IconNeutral]
    );

    return {
      transform: [{ scale: scale }],
      backgroundColor,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => {
    const theta = 135 * progress.value;
    return {
      transform: [{ rotateZ: `${theta}deg` }],
    };
  });

  return (
    <AnimatedPressable
      style={[styles.button, { marginBottom: 0 }, buttonContainerAnimatedStyle]}
      onPress={() => (open.value = !open.value)}
    >
      <Animated.View style={iconAnimatedStyle}>
        <Ionicons name="ios-add" size={50} color={Colors.IconOnPrimary} />
      </Animated.View>
    </AnimatedPressable>
  );
};

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
    return 60 * (open.value ? index : 2 - index);
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
      <Pressable
        onPress={() => {
          if (open.value) {
            console.log(`Action button type ${action} tapped`);
          }
        }}
      >
        {Actions[action]}
      </Pressable>
    </Animated.View>
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
    backgroundColor: Colors.IconInteractive,
    shadowRadius: 3,
    shadowColor: "#171717",
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.8,
  },
});
