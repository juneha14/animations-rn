import React, { useState } from "react";
import { Text, View, Pressable, ViewStyle } from "react-native";
import Animated, {
  AnimatedStyleProp,
  Easing,
  Extrapolate,
  interpolate,
  measure,
  runOnJS,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { HeaderSearchBar } from "./HeaderSearchBar";
import { Divider, SNAP_POINTS, THRESHOLD } from "./utils";
import { Colors, snapPoints, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export const AppleMail: React.FC = () => {
  const [data, setData] = useState([...Array(15).keys()]);

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      style={{ flex: 1, backgroundColor: Colors.SurfaceForeground }}
      contentContainerStyle={{
        paddingVertical: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceForeground,
      }}
      scrollEventThrottle={16}
      onScroll={onScroll}
    >
      <HeaderSearchBar scrollY={scrollY} />
      {data.map((val) => {
        return (
          <Row
            key={val}
            val={val}
            onDelete={() => {
              return setData((d) => {
                const filtered = d.filter((v) => v !== val);
                return filtered;
              });
            }}
          />
        );
      })}
    </Animated.ScrollView>
  );
};

const Row = ({ val, onDelete }: { val: number; onDelete: () => void }) => {
  const startOffsetX = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const height = useSharedValue(0);
  const rowRef = useAnimatedRef<View>();
  const shouldDelete = useSharedValue(false);
  const deleteProgress = useDerivedValue(() => {
    return withTiming(shouldDelete.value ? 0 : 1);
  });

  // Calculate height of row
  useAnimatedReaction(
    () => Math.abs(offsetX.value) > 0,
    (v) => {
      if (v && height.value === 0) {
        const h = measure(rowRef).height;
        height.value = h;
      }
    }
  );

  // Invoke onDelete iff animated height reaches 0
  useAnimatedReaction(
    () => deleteProgress.value,
    (progress) => {
      if (progress === 0) {
        runOnJS(onDelete)();
      }
    },
    [onDelete]
  );

  const deleteAnimatedStyle = useAnimatedStyle(() => {
    return {
      height:
        height.value === 0 ? undefined : height.value * deleteProgress.value,
    };
  });

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
    .failOffsetY([-15, 15])
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
          if (e.velocityX < -500) {
            // Quickly swiped
            snapPoint = SNAP_POINTS[2];
          } else if (e.velocityX < 0 || e.velocityX > 0) {
            // Not quickly swiped enough OR pan gesture is moving back towards the origin
            snapPoint = SNAP_POINTS[1];
          }
        }
      }

      if (snapPoint === SNAP_POINTS[2]) {
        shouldDelete.value = true;
      }

      springifyX(snapPoint);
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[{ overflow: "hidden" }, deleteAnimatedStyle]}>
        <View ref={rowRef}>
          <Divider />
          <Content val={val} offsetX={offsetX} />
        </View>

        {/* Delete action icon button */}
        <DeleteAction
          offsetX={offsetX}
          animatedStyle={deleteAnimatedStyle}
          onPress={() => {
            springifyX(SNAP_POINTS[2]);
            shouldDelete.value = true;
          }}
        />
      </Animated.View>
    </GestureDetector>
  );
};

const AnimatedButton = Animated.createAnimatedComponent(Pressable);

const DeleteAction = ({
  offsetX,
  onPress,
  animatedStyle,
}: {
  offsetX: Animated.SharedValue<number>;
  onPress: () => void;
  animatedStyle: AnimatedStyleProp<ViewStyle>;
}) => {
  const iconX = useSharedValue(0);
  const reachedThreshold = useSharedValue(false);
  const deletePressed = useSharedValue(false);

  useAnimatedReaction(
    () => offsetX.value,
    (x) => {
      if (deletePressed.value) {
        iconX.value = x + 80;
        return;
      }

      // offsetX is negative, so this means that we have panned to the left and are about to delete
      if (x <= THRESHOLD) {
        if (!reachedThreshold.value) {
          reachedThreshold.value = true;
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        }

        iconX.value = withTiming(x + 80, {
          duration: 600,
          easing: Easing.out(Easing.exp), // This easing looks like the key to a smoother animation; and doesn't require us to 'wait' for the initial translation animation to complete
        });
      } else {
        if (reachedThreshold.value) {
          reachedThreshold.value = false;
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);

          iconX.value = withTiming(0, {
            duration: 500,
            easing: Easing.out(Easing.exp),
          });
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
    const width = interpolate(
      offsetX.value,
      [SNAP_POINTS[2], -80, 0],
      [-SNAP_POINTS[2], 80, 80],
      Extrapolate.CLAMP
    );
    const translateX = interpolate(
      offsetX.value,
      [-80, 0],
      [0, 80],
      Extrapolate.CLAMP
    );

    return {
      width,
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
        animatedStyle,
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
        onPress={() => {
          deletePressed.value = true;
          onPress();
        }}
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
      transform: [{ translateX: Math.min(offsetX.value, 0) }],
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
