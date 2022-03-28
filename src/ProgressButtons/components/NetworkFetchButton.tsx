import React, { useEffect } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { Pressable, StyleSheet, View } from "react-native";
import { Colors, Spacing } from "../../utils";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const BUTTON_WIDTH = 300;
const BUTTON_HEIGHT = 60;
const BORDER_RADIUS = BUTTON_HEIGHT / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const NetworkFetchButton = () => {
  const renderInitialState = useSharedValue(true);
  const renderLoadingState = useSharedValue(false);

  const containerWidth = useSharedValue(BUTTON_WIDTH);
  const containerAStyle = useAnimatedStyle(() => {
    return {
      width: containerWidth.value,
    };
  });

  return (
    <AnimatedPressable
      style={[
        {
          justifyContent: "center",
          alignItems: "center",
          height: BUTTON_HEIGHT,
          borderRadius: BORDER_RADIUS,
          marginTop: Spacing.defaultMargin,
          overflow: "hidden",
          backgroundColor: "pink",
        },
        containerAStyle,
      ]}
      onPress={() => {
        containerWidth.value = withTiming(60, { easing: Easing.linear });
        renderInitialState.value = false;
        renderLoadingState.value = true;
      }}
    >
      <StartContainer render={renderInitialState} />
      <LoadingContainer render={renderLoadingState} />
    </AnimatedPressable>
  );
};

const LoadingContainer = ({
  render,
}: {
  render: Animated.SharedValue<boolean>;
}) => {
  const opacity = useSharedValue(0);
  const loadingRotation = useSharedValue(-50);
  const loadingScale = useSharedValue(0);

  useAnimatedReaction(
    () => render.value,
    (shouldRender) => {
      if (shouldRender) {
        loadingRotation.value = withRepeat(
          withTiming(310, { duration: 800, easing: Easing.linear }),
          -1,
          false
        );
        loadingScale.value = withDelay(150, withTiming(1, { duration: 500 }));
        opacity.value = withTiming(1);
      } else {
        cancelAnimation(loadingRotation);
        loadingScale.value = withTiming(0);
        opacity.value = withTiming(0);
      }
    }
  );

  const iconAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${loadingRotation.value}deg` }],
    };
  });

  const aStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: loadingScale.value }],
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        },
        aStyle,
      ]}
    >
      <Animated.View style={iconAStyle}>
        <AntDesign name="loading1" size={30} color={Colors.ActionPrimary} />
      </Animated.View>
    </Animated.View>
  );
};

const StartContainer = ({
  render,
}: {
  render: Animated.SharedValue<boolean>;
}) => {
  const iconRotation = useDerivedValue(() => {
    return render.value ? 0 : withTiming(180);
  });

  const opacity = useDerivedValue(() => {
    return withTiming(render.value ? 1 : 0, { duration: 400 });
  });

  const iconAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${iconRotation.value}deg` }],
    };
  });

  const aStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        },
        aStyle,
      ]}
    >
      <Animated.View style={iconAStyle}>
        <Ionicons
          name="ios-arrow-forward-outline"
          size={30}
          color={Colors.IconOnPrimary}
        />
      </Animated.View>
    </Animated.View>
  );
};
