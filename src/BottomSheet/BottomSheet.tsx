import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Colors, Palette, snapPoints } from "../utils";

const { width, height } = Dimensions.get("window");

const SNAP_POINTS_2 = [0, -height * 0.35, -height * 0.9];
export const FULLY_CLOSED = SNAP_POINTS_2[0];
export const PREVIEW = SNAP_POINTS_2[1];
const FULLY_OPENED = SNAP_POINTS_2[2];

export const BottomSheet = ({
  open,
  onDismissSheet,
  onUpdateOffsetY,
}: {
  open: boolean;
  onDismissSheet: () => void;
  onUpdateOffsetY: (offsetY: Animated.SharedValue<number>) => void;
}) => {
  const offsetY = useSharedValue(0);
  const startOffsetY = useSharedValue(0);

  // Notify back to parent component of offsetY changes so that we can change its opacity
  useDerivedValue(() => {
    runOnJS(onUpdateOffsetY)(offsetY);
  }, [onUpdateOffsetY]);

  // Open or close bottom sheet on external button press
  useEffect(() => {
    offsetY.value = withTiming(open ? PREVIEW : FULLY_CLOSED);
  }, [offsetY, open]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startOffsetY.value = offsetY.value;
    })
    .onUpdate((e) => {
      offsetY.value = e.translationY + startOffsetY.value;
    })
    .onEnd((e) => {
      const snapPoint = snapPoints(offsetY.value, e.velocityY, SNAP_POINTS_2);

      offsetY.value = withSpring(snapPoint, {
        overshootClamping: true,
        damping: 50,
        mass: 0.3,
        stiffness: 121.6,
        restSpeedThreshold: 0.3,
        restDisplacementThreshold: 0.3,
      });

      if (snapPoint === FULLY_CLOSED) {
        runOnJS(onDismissSheet)();
      }

      /*
      // Initial approach to determine destination snap point
      const SNAP_POINTS = {
        hidden: height,
        opened: height * 0.35,
        full: height * 0.9,
      };
      const SNAP_UP_THRESHOLD = height * 0.6;

      const absOffsetY = Math.abs(offsetY.value);
      const absVelY = Math.abs(e.velocityY);
      const panVelocityOffset =
        absOffsetY + absVelY * 0.074 * (e.velocityY < 0 ? 1 : -1);
      const comp = absOffsetY > absVelY ? absOffsetY : panVelocityOffset;

      let destSnapPoint = -SNAP_POINTS.full;
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
      */
    });

  const animatedStyle = useAnimatedStyle(() => {
    const clampedTranslateY = Math.max(offsetY.value, FULLY_OPENED);
    return {
      transform: [
        {
          translateY: clampedTranslateY,
        },
      ],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <GestureDetector gesture={panGesture}>
        <View>
          <View style={styles.sheetHeader}>
            <View style={styles.sheetHeaderIndicator} />
          </View>
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            /*
             * https://github.com/software-mansion/react-native-gesture-handler/issues/420#issuecomment-837752503
             * https://github.com/software-mansion/react-native-gesture-handler/blob/main/example/src/new_api/bottom_sheet/index.tsx

             * Tried to follow reanimated example to disable scroll when contentOffsetY < 0
             * and let pan gesture take over to dismiss the bottom sheet. Unfortunately, this
             * isn't working for me. Will need to revisit this and see if using v1 of gesture handler
             * (i.e. <PanGestureHandler>) will fix it
            */
            scrollEnabled={false}
          >
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
      }}
    >
      <Text>{val}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: height, // initially hide the bottom sheet (remember y=0 is the top)
    width: width,
    height: FULLY_OPENED,
    overflow: "hidden",
  },
  contentContainer: {
    backgroundColor: Colors.SurfaceBackgroundPressed,
  },
  sheetHeader: {
    alignItems: "center",
    height: 44,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: Palette.Grey.Primary,
  },
  sheetHeaderIndicator: {
    width: 40,
    height: 6,
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: Colors.SurfaceBackgroundPressed,
  },
});
