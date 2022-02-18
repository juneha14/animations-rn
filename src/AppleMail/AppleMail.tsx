import React from "react";
import { Dimensions, Text, View, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import { Colors, snapPoints, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Multiple action row buttons
// Search bar scale animation

export const AppleMail: React.FC = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.SurfaceForeground }}
      contentContainerStyle={{
        paddingVertical: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceForeground,
      }}
    >
      <Header />
      {[...Array(10).keys()].map((val) => {
        return <Row key={val} val={val} />;
      })}
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");
const SNAP_POINTS = [0, -80, -width];

const Row = ({ val }: { val: number }) => {
  const startOffsetX = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .failOffsetY([-5, 5])
    .activeOffsetX([-5, 5])
    .averageTouches(true)
    .onStart(() => {
      startOffsetX.value = offsetX.value;
    })
    .onUpdate((e) => {
      offsetX.value = startOffsetX.value + e.translationX;
    })
    .onEnd((e) => {
      const snapPoint = snapPoints(offsetX.value, e.velocityX, SNAP_POINTS);

      //   if (snapPoint === SNAP_POINTS[2] && offsetX.value > snapPoint) {
      //     snapPoint = SNAP_POINTS[1];
      //   }

      offsetX.value = withSpring(snapPoint, {
        overshootClamping: true,
        damping: 50,
        mass: 0.3,
        stiffness: 121.6,
        restSpeedThreshold: 0.3,
        restDisplacementThreshold: 0.3,
      });
    });

  const aStyle = useAnimatedStyle(() => {
    const translateX = Math.min(offsetX.value, 0);

    return {
      transform: [
        {
          translateX: offsetX.value,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      {/* <View style={{ flexDirection: "row" }}> */}
      {/* Row content container */}
      <View>
        {/* Divider */}
        <View
          style={{
            height: 1,
            marginLeft: Spacing.xl,
            backgroundColor: Colors.BorderSubdued,
          }}
        />

        {/* Content container */}
        <Animated.View
          style={[
            {
              paddingVertical: Spacing.m,
              paddingRight: Spacing.l,
              paddingLeft: Spacing.xl,
            },
            aStyle,
          ]}
        >
          {/* Contact and date */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                fontWeight: "500",
                fontSize: 17,
              }}
            >{`John Doe ${val}`}</Text>
            <Text style={{ color: Colors.TextSubdued }}>Friday</Text>
          </View>

          {/* Mail title and content preview */}
          <View>
            <Text
              style={{
                fontSize: 15,
                marginBottom: 5,
                color: Colors.TextNeutral,
              }}
            >
              Money Team Update: January 2022
            </Text>
            <Text
              style={{ color: Colors.TextSubdued, fontSize: 15 }}
              numberOfLines={2}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </View>
        </Animated.View>

        <DeleteAction offsetX={offsetX} />
        {/* <RowActionContainer offsetX={offsetX} /> */}
      </View>

      {/* Row action button container */}
      {/* <RowActionButton offsetX={offsetX} type="more" index={2} />
        <RowActionButton offsetX={offsetX} type="move" index={1} />
        <RowActionButton offsetX={offsetX} type="trash" index={0} /> */}
      {/* </View> */}
    </GestureDetector>
  );
};

const DeleteAction = ({
  offsetX,
}: {
  offsetX: Animated.SharedValue<number>;
}) => {
  const reachedThreshold = useSharedValue(false);
  const iconX = useSharedValue(0);
  const animationComplete = useSharedValue(true);

  useAnimatedReaction(
    () => Math.abs(offsetX.value),
    (x) => {
      if (x >= -SNAP_POINTS[2] - Spacing.xl) {
        if (!reachedThreshold.value) {
          reachedThreshold.value = true;
          animationComplete.value = false;

          iconX.value = withTiming(
            -x + 60,
            { duration: 100 },
            () => (animationComplete.value = true)
          );
        } else if (x > 201 && animationComplete.value) {
          //   iconX.value = -x + 60;
          iconX.value = withTiming(-x + 60, { duration: 30 });
        }
      } else {
        if (reachedThreshold.value) {
          reachedThreshold.value = false;
          iconX.value = withTiming(0, { duration: 150 });
        }
      }
    }
  );

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: iconX.value,
        },
      ],
    };
  });

  const aStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      offsetX.value,
      [-80, 0],
      [0, 80],
      Extrapolate.CLAMP
    );

    return {
      width: Math.max(Math.abs(offsetX.value), 80),
      transform: [{ translateX }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          backgroundColor: "red",
        },
        aStyle,
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            bottom: 0,
            // width: "100%",
            // left: 30,
            right: 25,
            justifyContent: "center",
            alignItems: "center",
            // backgroundColor: "pink",
          },
          iconAnimatedStyle,
        ]}
      >
        <Ionicons
          name="ios-trash-outline"
          size={25}
          color={Colors.TextOnSurfacePrimary}
        />
      </Animated.View>
    </Animated.View>
  );
};

const RowActionContainer = ({
  offsetX,
}: {
  offsetX: Animated.SharedValue<number>;
}) => {
  const aStyle = useAnimatedStyle(() => {
    const scaleFactor = Math.abs(SNAP_POINTS[2] / SNAP_POINTS[1]);

    const width = interpolate(
      offsetX.value,
      [
        SNAP_POINTS[2],
        SNAP_POINTS[2] + Spacing.xl + 2,
        SNAP_POINTS[1],
        SNAP_POINTS[0],
      ],
      [-SNAP_POINTS[2], 80 * 3 * scaleFactor, 80 * 3, 0],
      Extrapolate.CLAMP
    );
    return {
      width: width,
    };
  });

  return (
    <Animated.View
      style={[
        {
          //   ...StyleSheet.absoluteFillObject,
          flexDirection: "row",
          //   flex: 1,
          //   justifyContent: "flex-end",
          position: "absolute",
          right: 0,
          height: "100%",
          backgroundColor: "pink",
        },
        aStyle,
      ]}
    >
      <RowAction type="more" offsetX={offsetX} />
      <RowAction type="move" offsetX={offsetX} />
      <RowAction type="trash" offsetX={offsetX} />
    </Animated.View>
  );
};

const RowAction = ({
  type,
  offsetX,
}: {
  type: keyof typeof RowActions;
  offsetX: Animated.SharedValue<number>;
}) => {
  const reachedThreshold = useSharedValue(false);
  const flex1 = useSharedValue(1);
  const animationInProgress = useSharedValue(false);
  const scaleFactor = Math.abs(SNAP_POINTS[2] / SNAP_POINTS[1]);

  useAnimatedReaction(
    () => offsetX.value,
    (x) => {
      if (!animationInProgress.value) {
        if (x <= SNAP_POINTS[2] + Spacing.xl) {
          animationInProgress.value = true;
          reachedThreshold.value = true;

          //   flex1.value = withSpring(
          //     80 * 2 * scaleFactor,
          //     {
          //       overshootClamping: true,
          //       damping: 50,
          //       mass: 0.3,
          //       stiffness: 121.6,
          //       restSpeedThreshold: 0.3,
          //       restDisplacementThreshold: 0.3,
          //     },
          //     () => (animationInProgress.value = false)
          //   );

          flex1.value = withTiming(
            80 * 3 * scaleFactor,
            { duration: 1000 },
            () => (animationInProgress.value = false)
          );
        } else {
          animationInProgress.value = true;
          reachedThreshold.value = false;

          flex1.value = withTiming(
            80,
            { duration: 1000 },
            () => (animationInProgress.value = false)
          );
        }
      }
    }
  );

  const aStyle = useAnimatedStyle(() => {
    if (type !== "trash") return {};

    const f = interpolate(
      offsetX.value,
      [
        // SNAP_POINTS[2] + Spacing.xl,
        SNAP_POINTS[2] + Spacing.xl + 2,
        SNAP_POINTS[1],
        SNAP_POINTS[0],
      ],
      [90, 1, 1],
      Extrapolate.CLAMP
    );

    return {
      //   flex: flex1.value,
      //   transform: [
      //     {
      //       scaleX: flex1.value,
      //     },
      //   ],
      width: flex1.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          backgroundColor: RowActions[type].color,
          //   width: 80,
        },
        aStyle,
      ]}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
        }}
      >
        {/* <Ionicons
          name={RowActions[type].icon as keyof typeof Ionicons.glyphMap}
          color={Colors.TextOnSurfacePrimary}
          size={24}
        />
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          {RowActions[type].name}
        </Text> */}
      </View>
    </Animated.View>
  );
};

const RowActionButton = ({
  offsetX,
  type,
  index,
}: {
  offsetX: Animated.SharedValue<number>;
  index: number;
  type: keyof typeof RowActions;
}) => {
  const width = useSharedValue(0);
  const reachedThreshold = useSharedValue(false);
  const animationComplete = useSharedValue(true);

  useAnimatedReaction(
    () => offsetX.value,
    (translateX) => {
      const inputRange = [SNAP_POINTS[2], SNAP_POINTS[1], SNAP_POINTS[0]];
      const scaleFactor = Math.abs(SNAP_POINTS[2] / SNAP_POINTS[1]);

      if (type === "trash") {
        const threshold = SNAP_POINTS[2] + Spacing.xl + 2;
        const interpolated = interpolate(
          translateX,
          [SNAP_POINTS[2] + Spacing.xl + 2, SNAP_POINTS[1], SNAP_POINTS[0]],
          [80 * scaleFactor, 80, 0],
          Extrapolate.CLAMP
        );

        if (translateX <= threshold) {
          if (reachedThreshold.value) return;
          reachedThreshold.value = true;
          width.value = withTiming(-SNAP_POINTS[2], { duration: 300 });
          //   if (reachedThreshold.value) return;
          //   reachedThreshold.value = true;
          //   width.value = withTiming(80 * 3 * scaleFactor, { duration: 300 });
        } else if (
          reachedThreshold.value &&
          translateX > threshold
          // translateX < SNAP_POINTS[1]
        ) {
          if (!animationComplete.value) return;
          animationComplete.value = false;
          animationComplete.value = true;
          width.value = withTiming(interpolated, { duration: 200 }, () => {
            animationComplete.value = true;
            reachedThreshold.value = false;
          });
        } else if (animationComplete.value) {
          width.value = interpolated;
          //   reachedThreshold.value = false;
          //   width.value = interpolate(
          //     translateX,
          //     [
          //       SNAP_POINTS[2],
          //       SNAP_POINTS[2] + Spacing.xl,
          //       SNAP_POINTS[1],
          //       SNAP_POINTS[0],
          //     ],
          //     [-SNAP_POINTS[2], 80 * scaleFactor, 80, 0],
          //     Extrapolate.CLAMP
          //   );
        }
      } else {
        width.value = interpolate(
          translateX,
          inputRange,
          [80 * (index + 1) * scaleFactor, 80 * (index + 1), 0],
          Extrapolate.CLAMP
        );
      }
    },
    [index]
  );

  const aStyle = useAnimatedStyle(() => {
    const inputRange = [SNAP_POINTS[2], SNAP_POINTS[1], SNAP_POINTS[0]];
    const scaleFactor = Math.abs(SNAP_POINTS[2] / SNAP_POINTS[1]);

    // const width = interpolate(
    //   offsetX.value,
    //   inputRange,
    //   [80 * (index + 1) * scaleFactor, 80 * (index + 1), 0],
    //   Extrapolate.CLAMP
    // );

    return {
      //   width,
      width: width.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 0,
          justifyContent: "center",
          width: 80,
          height: "100%",
          backgroundColor: RowActions[type].color,
        },
        aStyle,
      ]}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
        }}
      >
        <Ionicons
          name={RowActions[type].icon as keyof typeof Ionicons.glyphMap}
          color={Colors.TextOnSurfacePrimary}
          size={24}
        />
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          {RowActions[type].name}
        </Text>
      </View>
    </Animated.View>
  );
};

const RowActions = {
  trash: {
    name: "Trash",
    color: "red",
    icon: "ios-trash-outline",
  },
  move: {
    name: "Move",
    color: "indigo",
    icon: "ios-folder-outline",
  },
  more: {
    name: "More",
    color: "grey",
    icon: "ellipsis-horizontal-circle-outline",
  },
};

const Header = () => {
  return (
    <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.m }}>
      <Text style={{ fontWeight: "700", fontSize: 30 }}>Inbox</Text>
      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 5,
          paddingVertical: 8,
          borderRadius: 10,
          marginTop: Spacing.m,
          marginLeft: -10,
          backgroundColor: Colors.SurfaceBackgroundPressed,
        }}
      >
        <Ionicons
          name="ios-search-outline"
          size={20}
          color={Colors.IconNeutral}
          style={{ marginRight: Spacing.s }}
        />
        <Text style={{ color: Colors.TextSubdued, fontSize: 16 }}>Search</Text>
      </View>
    </View>
  );
};
