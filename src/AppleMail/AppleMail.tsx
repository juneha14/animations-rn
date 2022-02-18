import React from "react";
import { Dimensions, Text, View, Pressable } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
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
const THRESHOLD = SNAP_POINTS[2] + Spacing.xl;

const Row = ({ val }: { val: number }) => {
  const startOffsetX = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const springifyX = (x: number) => {
    "worklet";

    offsetX.value = withSpring(x, {
      overshootClamping: true,
      damping: 50,
      mass: 0.3,
      stiffness: 121.6,
      restSpeedThreshold: 0.3,
      restDisplacementThreshold: 0.3,
    });
  };

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
      let snapPoint = snapPoints(offsetX.value, e.velocityX, SNAP_POINTS);

      if (snapPoint === SNAP_POINTS[2]) {
        if (offsetX.value > THRESHOLD) {
          if (e.velocityX < -200) {
            // Quickly swiped
            snapPoint = SNAP_POINTS[2];
          } else if (e.velocityX < 0 || e.velocityX > 0) {
            // Not quickly swiped enough OR pan gesture is moving back towards the origin
            snapPoint = SNAP_POINTS[1];
          }
        }
      }

      springifyX(snapPoint);
    });

  return (
    <GestureDetector gesture={panGesture}>
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

        <Content val={val} offsetX={offsetX} />
        <DeleteAction
          offsetX={offsetX}
          onPress={() => {
            springifyX(SNAP_POINTS[2]);
          }}
        />
      </View>
    </GestureDetector>
  );
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const DeleteAction = ({
  offsetX,
  onPress,
}: {
  offsetX: Animated.SharedValue<number>;
  onPress: () => void;
}) => {
  const iconX = useSharedValue(0);
  const reachedThreshold = useSharedValue(false);
  const thresholdAnimationComplete = useSharedValue(true);

  useAnimatedReaction(
    () => offsetX.value,
    (x) => {
      if (x <= THRESHOLD) {
        if (!reachedThreshold.value) {
          reachedThreshold.value = true;
          thresholdAnimationComplete.value = false;

          iconX.value = withTiming(
            x + 80, // Offset by the width of the icon (=== 80)
            { duration: 150 },
            () => (thresholdAnimationComplete.value = true)
          );
        } else if (thresholdAnimationComplete.value) {
          iconX.value = withTiming(x + 80, { duration: 30 });
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
          alignItems: "flex-end",
          backgroundColor: "red",
        },
        aStyle,
      ]}
    >
      {/* Trash icon */}
      <AnimatedButton
        style={[
          {
            position: "absolute",
            width: 80,
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          iconAnimatedStyle,
        ]}
        onPress={onPress}
      >
        <Ionicons
          name="ios-trash-outline"
          size={25}
          color={Colors.TextOnSurfacePrimary}
        />
      </AnimatedButton>
    </Animated.View>
  );
};

const Content = ({
  val,
  offsetX,
}: {
  val: number;
  offsetX: Animated.SharedValue<number>;
}) => {
  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: Math.min(offsetX.value, 0),
        },
      ],
    };
  });

  return (
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
  );
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
