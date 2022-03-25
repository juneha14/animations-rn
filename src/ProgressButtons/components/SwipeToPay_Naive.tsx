import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { clamp, Colors, Spacing } from "../../utils";
import { Ionicons } from "@expo/vector-icons";

const BUTTON_WIDTH = 300;
const BUTTON_HEIGHT = 60;

const ARROW_SIZE = 50;
const PADDING = Spacing.s;
type SwipePayStatus = "buy" | "pending" | "paid";
const AnimatedIcon = Animated.createAnimatedComponent(Ionicons);

export const SwipeToPay_NonComponetized = () => {
  const [status, setStatus] = useState<SwipePayStatus>("buy");

  const buyNowOpacity = useSharedValue(1);
  const swipeToPayContainerOpacity = useSharedValue(0);
  const doneCheckmarkOpacity = useSharedValue(0);
  const doneCheckmarkOffsetX = useSharedValue(145);
  const swipeOffsetX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const offsetX = clamp(
        e.translationX,
        0,
        BUTTON_WIDTH - ARROW_SIZE - 2 * PADDING
      );
      swipeOffsetX.value = offsetX;
    })
    .onEnd(() => {
      const endPos = swipeOffsetX.value + ARROW_SIZE;
      const isInPayZone =
        endPos >= BUTTON_WIDTH - ARROW_SIZE - 2 * PADDING &&
        endPos <= BUTTON_WIDTH - PADDING;

      if (isInPayZone) {
        swipeOffsetX.value = withTiming(
          BUTTON_WIDTH - ARROW_SIZE - 2 * PADDING,
          undefined,
          () => {
            runOnJS(setStatus)("paid");
          }
        );
      } else {
        swipeOffsetX.value = withTiming(0);
      }
    });

  const resetToBuy = () => {
    setTimeout(() => {
      setStatus("buy");
    }, 1500);
  };

  useAnimatedReaction(
    () => status,
    (s) => {
      switch (s) {
        case "buy": {
          buyNowOpacity.value = 1;
          swipeToPayContainerOpacity.value = 0;
          doneCheckmarkOpacity.value = 0;
          doneCheckmarkOffsetX.value = 145;
          swipeOffsetX.value = 0;
          break;
        }
        case "pending": {
          buyNowOpacity.value = withTiming(0, { duration: 100 }, () => {
            swipeToPayContainerOpacity.value = withDelay(100, withTiming(1));
          });
          break;
        }
        case "paid": {
          swipeToPayContainerOpacity.value = withTiming(0);
          doneCheckmarkOpacity.value = withDelay(
            200,
            withTiming(1, undefined, () => {
              doneCheckmarkOffsetX.value = withDelay(200, withTiming(0));
              swipeOffsetX.value = withDelay(
                200,
                withTiming(0, undefined, () => {
                  runOnJS(resetToBuy)();
                })
              );
            })
          );
          break;
        }
      }
    },
    [status]
  );

  const buyNowAStyle = useAnimatedStyle(() => {
    return {
      opacity: buyNowOpacity.value,
    };
  });

  const swipeToPayContainerAStyle = useAnimatedStyle(() => {
    return {
      opacity: swipeToPayContainerOpacity.value,
      zIndex: swipeToPayContainerOpacity.value * 1,
    };
  });

  const swipeTextAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        swipeOffsetX.value,
        [0, 50],
        [0.8, 0],
        Extrapolate.CLAMP
      ),
    };
  });

  const swipeArrowAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: swipeOffsetX.value }],
    };
  });

  const dummyButtonContainerAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: swipeOffsetX.value }],
    };
  });

  const doneCheckmarkAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: doneCheckmarkOffsetX.value }],
      opacity: doneCheckmarkOpacity.value,
    };
  });

  const doneTextAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        doneCheckmarkOffsetX.value,
        [10, 0],
        [0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <Pressable
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          width: BUTTON_WIDTH,
          height: BUTTON_HEIGHT,
          borderRadius: BUTTON_HEIGHT / 2,
          marginTop: Spacing.defaultMargin,
          overflow: "hidden",
        },
      ]}
      onPress={() => {
        if (status === "buy") {
          setStatus("pending");
        }
      }}
    >
      {/* Dummy button container with action button backgroundColor */}
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: Colors.ActionPrimary,
          },
          dummyButtonContainerAStyle,
        ]}
      />

      {/* Swipe to pay container */}
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: PADDING,
          },
          swipeToPayContainerAStyle,
        ]}
      >
        {/* Swipe arrow */}
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                width: ARROW_SIZE,
                height: ARROW_SIZE,
                borderRadius: ARROW_SIZE / 2,
                borderWidth: 1,
                borderColor: Colors.IconOnPrimary,
              },
              swipeArrowAStyle,
            ]}
          >
            <Ionicons
              name="ios-chevron-forward-outline"
              size={20}
              color={Colors.IconOnPrimary}
            />
          </Animated.View>
        </GestureDetector>

        {/* Text and outline-view */}
        <Animated.Text
          style={[
            { color: Colors.TextOnSurfacePrimary, fontSize: 16 },
            swipeTextAStyle,
          ]}
        >
          Swipe to pay
        </Animated.Text>
        <View
          style={{
            width: ARROW_SIZE,
            height: ARROW_SIZE,
            borderRadius: ARROW_SIZE / 2,
            borderWidth: 1,
            borderColor: Colors.BorderSubdued,
            opacity: 0.5,
          }}
        />
      </Animated.View>

      {/* Buy now text */}
      <Animated.Text
        style={[
          {
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            fontWeight: "700",
          },
          buyNowAStyle,
        ]}
      >
        Buy now (non-componetized)
      </Animated.Text>

      {/* Done container */}
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AnimatedIcon
          name="ios-checkmark-outline"
          size={20}
          color={Colors.IconOnPrimary}
          style={doneCheckmarkAStyle}
        />
        <Animated.Text
          style={[
            {
              color: Colors.TextOnSurfacePrimary,
              fontSize: 16,
              fontWeight: "700",
              marginLeft: Spacing.m,
            },
            doneTextAStyle,
          ]}
        >
          Done
        </Animated.Text>
      </View>
    </Pressable>
  );
};
