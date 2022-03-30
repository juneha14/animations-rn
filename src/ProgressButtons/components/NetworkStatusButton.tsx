import React, { useState } from "react";
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Pressable, StyleSheet, Text } from "react-native";
import { Colors, Spacing } from "../../utils";
import { Ionicons, AntDesign, SimpleLineIcons } from "@expo/vector-icons";

const BUTTON_WIDTH = 300;
const BUTTON_HEIGHT = 60;
const BORDER_RADIUS = BUTTON_HEIGHT / 2;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Status = "none" | "loading" | "success" | "failure";

export const NetworkStatusButton = () => {
  const [status, setStatus] = useState<Status>("none");

  const renderInitialState = useSharedValue(true);
  const renderLoadingState = useSharedValue(false);
  const renderFailureState = useSharedValue(false);
  const renderSuccessState = useSharedValue(false);

  const containerWidth = useSharedValue(BUTTON_WIDTH);
  const containerWiggle = useSharedValue(0);

  useAnimatedReaction(
    () => status,
    (s) => {
      switch (s) {
        case "none": {
          renderInitialState.value = true;
          renderLoadingState.value = false;
          renderFailureState.value = false;
          renderSuccessState.value = false;

          containerWidth.value = BUTTON_WIDTH;
          break;
        }
        case "loading": {
          renderInitialState.value = false;
          renderLoadingState.value = true;
          renderFailureState.value = false;
          renderSuccessState.value = false;

          containerWidth.value = BUTTON_HEIGHT;
          break;
        }
        case "success": {
          renderInitialState.value = false;
          renderLoadingState.value = false;
          renderFailureState.value = false;
          renderSuccessState.value = true;
          break;
        }
        case "failure": {
          renderInitialState.value = false;
          renderLoadingState.value = false;
          renderFailureState.value = true;
          renderSuccessState.value = false;
          break;
        }
      }
    },
    [status]
  );

  const containerAStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(containerWidth.value, { easing: Easing.linear }),
      transform: [{ translateX: containerWiggle.value }],
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
          backgroundColor: Colors.SurfaceHighlight,
        },
        containerAStyle,
      ]}
      onPress={() => {
        if (status === "none") {
          setStatus("loading");
          setTimeout(() => {
            setStatus("failure");
          }, 2000);
        } else if (status === "failure") {
          setStatus("loading");
          setTimeout(() => {
            setStatus("success");
          }, 2000);
        } else if (status === "success" || status === "loading") {
          setStatus("none");
        }
      }}
    >
      <StartContainer render={renderInitialState} />
      <LoadingContainer render={renderLoadingState} />
      <FailureStatusContainer
        render={renderFailureState}
        containerWidth={containerWidth}
        containerWiggle={containerWiggle}
      />
      <SuccessStatusContainer render={renderSuccessState} />
    </AnimatedPressable>
  );
};

const SuccessStatusContainer = ({
  render,
}: {
  render: Animated.SharedValue<boolean>;
}) => {
  const progress = useDerivedValue(() => {
    return render.value ? withTiming(1, { duration: 500 }) : 0;
  });

  const aStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      progress.value,
      [0, 1],
      [-90, 0],
      Extrapolate.CLAMP
    );
    return {
      opacity: progress.value,
      zIndex: progress.value,
      transform: [{ rotateZ: `${rotation}deg` }],
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        [Colors.Transparent, Colors.IconSuccess]
      ),
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
      <Ionicons
        name="ios-checkmark-outline"
        size={30}
        color={Colors.IconOnPrimary}
      />
    </Animated.View>
  );
};

const FailureStatusContainer = ({
  render,
  containerWidth,
  containerWiggle,
}: {
  render: Animated.SharedValue<boolean>;
  containerWidth: Animated.SharedValue<number>;
  containerWiggle: Animated.SharedValue<number>;
}) => {
  const opacity = useSharedValue(0);
  const warningIconRotation = useSharedValue(-120);
  const warningIconOpacity = useSharedValue(1);
  const tryAgainOpacity = useSharedValue(0);

  const rendered = useSharedValue(false);

  useAnimatedReaction(
    () => render.value,
    (shouldRender) => {
      if (shouldRender) {
        rendered.value = true;

        opacity.value = withTiming(1, { duration: 500 });
        warningIconRotation.value = withTiming(0, { duration: 500 });

        containerWiggle.value = withDelay(
          500,
          withRepeat(
            withSequence(
              withTiming(5, { duration: 50, easing: Easing.linear }),
              withTiming(-5, { duration: 50, easing: Easing.linear }),
              withTiming(0, { duration: 50, easing: Easing.linear })
            ),
            2,
            false
          )
        );
        containerWidth.value = withDelay(
          900,
          withTiming(BUTTON_WIDTH, { easing: Easing.linear })
        );

        warningIconOpacity.value = withDelay(1000, withTiming(0));
        tryAgainOpacity.value = withDelay(1100, withTiming(1));
      } else if (rendered.value) {
        render.value = false;

        opacity.value = withTiming(0, { duration: 500 }, () => {
          warningIconOpacity.value = 1;
          warningIconRotation.value = -120;
        });
        tryAgainOpacity.value = withTiming(0, { duration: 500 });
      }
    }
  );

  const warningIconAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${warningIconRotation.value}deg` }],
      opacity: warningIconOpacity.value,
    };
  });

  const tryAgainAStyle = useAnimatedStyle(() => {
    return {
      opacity: tryAgainOpacity.value,
    };
  });

  const aStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      zIndex: opacity.value,
      backgroundColor: interpolateColor(
        opacity.value,
        [0, 1],
        [Colors.Transparent, Colors.ActionCritical]
      ),
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
      <Animated.View style={[{ position: "absolute" }, warningIconAStyle]}>
        <AntDesign name="exclamation" size={30} color={Colors.IconOnPrimary} />
      </Animated.View>

      <Animated.View
        style={[
          {
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
          },
          tryAgainAStyle,
        ]}
      >
        <Text
          style={[
            {
              color: Colors.IconOnPrimary,
              fontSize: 16,
              marginRight: Spacing.m,
            },
          ]}
        >
          Try again
        </Text>
        <SimpleLineIcons
          name="refresh"
          size={20}
          color={Colors.IconOnPrimary}
        />
      </Animated.View>
    </Animated.View>
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
        opacity.value = withTiming(1, { duration: 500 });
        loadingScale.value = withDelay(150, withTiming(1, { duration: 500 }));
        loadingRotation.value = withRepeat(
          withTiming(310, { duration: 800, easing: Easing.linear }),
          -1,
          false
        );
      } else {
        opacity.value = withTiming(0, { duration: 500 });
        loadingScale.value = withTiming(0);
        loadingRotation.value = -50;
        cancelAnimation(loadingRotation);
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
      zIndex: opacity.value,
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
        <AntDesign name="loading1" size={30} color={Colors.IconOnPrimary} />
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
    return render.value ? 0 : withTiming(180, { duration: 500 });
  });

  const opacity = useDerivedValue(() => {
    return withTiming(render.value ? 1 : 0, { duration: 500 });
  });

  const iconAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${iconRotation.value}deg` }],
    };
  });

  const aStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      zIndex: opacity.value,
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
