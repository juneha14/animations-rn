import React, { forwardRef, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  TextInput,
} from "react-native-gesture-handler";
import { panGestureHandlerCustomNativeProps } from "react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler";
import Animated, {
  block,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export const BottomSheet: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => {
          setOpen(true);
        }}
      >
        <Text>Open Bottom Sheet</Text>
      </Pressable>
      <Pressable
        style={styles.button}
        onPress={() => {
          setOpen(false);
        }}
      >
        <Text>Close Bottom Sheet</Text>
      </Pressable>
      <Sheet open={open} onDismissSheet={() => setOpen(false)} />
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const SNAP_POINTS = {
  hidden: height,
  opened: height * 0.35,
  full: height * 0.9,
};

const SNAP_UP_THRESHOLD = height * 0.6;

// TODO:
// put gesture on entire scrollView
// make it pretty
const Sheet = ({
  open,
  onDismissSheet,
}: {
  open: boolean;
  onDismissSheet: () => void;
}) => {
  const offsetY = useSharedValue(0);
  const startOffsetY = useSharedValue(0);

  useEffect(() => {
    // Open or close bottom sheet on external button press
    offsetY.value = withTiming(open ? -SNAP_POINTS.opened : 0);
  }, [offsetY, open]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startOffsetY.value = offsetY.value;
    })
    .onUpdate((e) => {
      offsetY.value = e.translationY + startOffsetY.value;
    })
    .onEnd((e) => {
      const absOffsetY = Math.abs(offsetY.value);
      const absVelY = Math.abs(e.velocityY);
      const panVelocityOffset =
        absOffsetY + absVelY * 0.074 * (e.velocityY < 0 ? 1 : -1);
      const comp = absOffsetY > absVelY ? absOffsetY : panVelocityOffset;

      let destSnapPoint = -SNAP_POINTS.full;

      // TODO: Think of a better way to determine the destination snap point
      // Possibly use redash library's snapPoints() function?
      if (comp > SNAP_UP_THRESHOLD) {
        // Open bottom sheet fully
        destSnapPoint = -SNAP_POINTS.full;
      } else if (comp <= SNAP_UP_THRESHOLD && comp >= SNAP_POINTS.opened) {
        // Collapse to original open position
        destSnapPoint = -SNAP_POINTS.opened;
      } else if (comp < SNAP_POINTS.hidden) {
        // Dismiss bottom sheet entirely
        destSnapPoint = 0;

        // AWARE: This causes a bit of a lag
        runOnJS(onDismissSheet)();
      }

      offsetY.value = withSpring(destSnapPoint, {
        overshootClamping: true,
        damping: 50,
        mass: 0.3,
        stiffness: 121.6,
        restSpeedThreshold: 0.3,
        restDisplacementThreshold: 0.3,
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    const clampedTranslateY = Math.max(offsetY.value, -SNAP_POINTS.full);
    return {
      transform: [
        {
          translateY: clampedTranslateY,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.sheetContainer, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View>
          <View style={styles.sheetNavBar} />
          <ScrollView scrollEnabled={false}>
            {[...Array(100).keys()].map((val) => {
              return <Item key={val} val={val} />;
            })}
          </ScrollView>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const Item = ({ val }: { val: number }) => {
  return (
    <View
      style={{
        width,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "pink",
      }}
    >
      <Text>{val}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 10,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "blue",
  },
  sheetContainer: {
    position: "absolute",
    top: SNAP_POINTS.hidden,
    width: width,
    height: SNAP_POINTS.full,
    overflow: "hidden",
    backgroundColor: "indigo",
  },
  sheetNavBar: {
    height: 50,
    backgroundColor: "grey",
  },
});
