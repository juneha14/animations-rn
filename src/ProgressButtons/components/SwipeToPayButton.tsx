import React, { useEffect, useState } from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
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

export const SwipeToPayButton_LayoutAnimation = () => {
  const [status, setStatus] = useState<SwipePayStatus>("buy");
  const offsetX = useSharedValue(0);

  let content;
  switch (status) {
    case "buy": {
      content = <BuyNowContainer />;
      break;
    }
    case "pending": {
      content = (
        <SwipeToPayContainer
          offsetX={offsetX}
          onPaid={() => {
            setStatus("paid");
          }}
        />
      );
      break;
    }
    case "paid": {
      content = (
        <DoneContainer
          offsetX={offsetX}
          onFinish={() => {
            setTimeout(() => {
              setStatus("buy");
            }, 3000);
          }}
        />
      );
      break;
    }
  }

  const dummyContainerAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }],
    };
  });

  return (
    <Pressable
      style={[
        {
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
      {/* Dummy background container */}
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: Colors.IconSuccess,
          },
          dummyContainerAStyle,
        ]}
      />

      {/* State view content */}
      {content}
    </Pressable>
  );
};

const SwipeToPayContainer = ({
  offsetX,
  onPaid,
}: {
  offsetX: Animated.SharedValue<number>;
  onPaid: () => void;
}) => {
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      offsetX.value = clamp(
        e.translationX,
        0,
        BUTTON_WIDTH - ARROW_SIZE - 2 * PADDING
      );
    })
    .onEnd(() => {
      const endPos = offsetX.value + ARROW_SIZE;
      const isInPayZone =
        endPos >= BUTTON_WIDTH - ARROW_SIZE - 2 * PADDING &&
        endPos <= BUTTON_WIDTH - PADDING;

      if (isInPayZone) {
        offsetX.value = withTiming(
          BUTTON_WIDTH - ARROW_SIZE - 2 * PADDING,
          undefined,
          () => runOnJS(onPaid)()
        );
      } else {
        offsetX.value = withTiming(0);
      }
    });

  const arrowAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }],
    };
  });

  const textAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(offsetX.value, [0, 50], [0.8, 0], Extrapolate.CLAMP),
    };
  });

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: PADDING,
        },
      ]}
      entering={FadeIn}
      exiting={FadeOut}
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
            arrowAStyle,
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
          textAStyle,
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
  );
};

const DoneContainer = ({
  offsetX,
  onFinish,
}: {
  offsetX: Animated.SharedValue<number>;
  onFinish: () => void;
}) => {
  const checkmarkOpacity = useSharedValue(0);

  useEffect(() => {
    checkmarkOpacity.value = withDelay(
      200,
      withTiming(1, undefined, () => {
        offsetX.value = withDelay(
          200,
          withTiming(0, undefined, () => runOnJS(onFinish)())
        );
      })
    );
  }, [offsetX, checkmarkOpacity, onFinish]);

  const checkmarkAStyle = useAnimatedStyle(() => {
    return {
      opacity: checkmarkOpacity.value,
      transform: [
        {
          translateX: interpolate(
            offsetX.value,
            [BUTTON_WIDTH - ARROW_SIZE - 2 * Spacing.s, 0],
            [145, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const textAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(offsetX.value, [10, 0], [0, 1], Extrapolate.CLAMP),
    };
  });

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnimatedIcon
        style={checkmarkAStyle}
        name="ios-checkmark-outline"
        size={20}
        color={Colors.IconOnPrimary}
      />
      <Animated.Text
        style={[
          {
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            fontWeight: "700",
            marginLeft: Spacing.m,
          },
          textAStyle,
        ]}
      >
        Done
      </Animated.Text>
    </View>
  );
};

const BuyNowContainer = () => {
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      exiting={FadeOut}
    >
      <Text
        style={{
          color: Colors.TextOnSurfacePrimary,
          fontSize: 16,
          fontWeight: "700",
        }}
      >
        Buy now (layout animation)
      </Text>
    </Animated.View>
  );
};
