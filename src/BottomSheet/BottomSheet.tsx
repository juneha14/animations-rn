import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
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
  opened: height * 0.2,
  full: height * 0.9,
};

const SNAP_THRESHOLD = height / 2;

// TODO:
// velocity based open/close
// put gesture on entire scrollView - don't active scrollView until it is fully opened
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
    offsetY.value = withTiming(open ? -SNAP_POINTS.opened : 0);
  }, [offsetY, open]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startOffsetY.value = offsetY.value;
    })
    .onUpdate((e) => {
      offsetY.value = e.translationY + startOffsetY.value;
    })
    .onEnd(() => {
      const absOffsetY = Math.abs(offsetY.value);

      if (absOffsetY > SNAP_THRESHOLD) {
        // Open bottom sheet fully
        offsetY.value = withTiming(-SNAP_POINTS.full);
      } else if (
        absOffsetY <= SNAP_THRESHOLD &&
        absOffsetY > SNAP_POINTS.opened
      ) {
        // Collapse to original open position
        offsetY.value = withTiming(-SNAP_POINTS.opened);
      } else {
        // Dismiss bottom sheet entirely
        offsetY.value = withTiming(0);
        runOnJS(onDismissSheet)();
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: offsetY.value,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.sheetContainer, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={[styles.sheetNavBar]} />
      </GestureDetector>
      <ScrollView>
        {[...Array(100).keys()].map((val, index) => {
          return <Item key={val} val={val} />;
        })}
      </ScrollView>
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
