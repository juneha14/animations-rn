import React, { useState } from "react";
import { Pressable, Text, View, StyleSheet } from "react-native";
import Animated, {
  cancelAnimation,
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors, Spacing } from "../utils";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

export const ProgressButtons: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      <DownloadButton />
      <SwipeToPayButton />
    </View>
  );
};

const SwipeToPayButton = () => {
  const [pressed, setPressed] = useState(false);

  const buyNowOpacity = useSharedValue(1);
  const swipeToPayOpacity = useSharedValue(0);
  const swipeOffsetX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      swipeOffsetX.value = e.translationX;
    })
    .onEnd((e) => {
      swipeOffsetX.value = withTiming(0);
    });

  useAnimatedReaction(
    () => pressed,
    (p) => {
      if (p) {
        buyNowOpacity.value = withTiming(0, { duration: 100 }, () => {
          swipeToPayOpacity.value = withDelay(100, withTiming(1));
        });
      } else {
        buyNowOpacity.value = 1;
        swipeToPayOpacity.value = 0;
      }
    },
    [pressed]
  );

  const buyNowAStyle = useAnimatedStyle(() => {
    return {
      opacity: buyNowOpacity.value,
      zIndex: interpolate(
        buyNowOpacity.value,
        [1, 0],
        [0, -1],
        Extrapolate.CLAMP
      ),
    };
  });

  const swipeToPayAStyle = useAnimatedStyle(() => {
    return {
      opacity: swipeToPayOpacity.value,
    };
  });

  const swipeArrowAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            swipeOffsetX.value,
            [0, BUTTON_WIDTH - 50 - 2 * Spacing.s],
            [0, BUTTON_WIDTH - 50 - 2 * Spacing.s],
            Extrapolate.CLAMP
          ),
        },
      ],
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
        if (!pressed) {
          setPressed(true);
        }
      }}
    >
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            paddingLeft: Spacing.s,
            borderRadius: BUTTON_HEIGHT / 2,
            backgroundColor: Colors.ActionPrimary,
          },
          swipeArrowAStyle,
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
            paddingHorizontal: Spacing.s,
          },
          swipeToPayAStyle,
        ]}
      >
        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                width: 50,
                height: 50,
                borderRadius: 25,
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
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            opacity: 0.8,
          }}
        >
          Swipe to pay
        </Text>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            borderWidth: 1,
            borderColor: Colors.BorderSubdued,
            opacity: 0.5,
          }}
        />
      </Animated.View>

      {/* Buy now text */}
      <Animated.View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            justifyContent: "center",
            alignItems: "center",
          },
          buyNowAStyle,
        ]}
      >
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Buy now
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const BUTTON_WIDTH = 300;
const BUTTON_HEIGHT = 60;
type DownloadStatus = "success" | "failed" | "downloading" | "none";

const DownloadButton = () => {
  const [status, setStatus] = useState<DownloadStatus>("none");

  // Values to control the different state container translationY
  const downloadTranslateY = useSharedValue(0);
  const loadingTranslateY = useSharedValue(0);
  const doneTranslateY = useSharedValue(0);

  // Values to control the download icon animation
  const loadingIconTranslateY = useSharedValue(0);
  const loadingIconOpacity = useSharedValue(1);
  const doneIconWiggle = useSharedValue(0);

  useAnimatedReaction(
    () => status,
    (s) => {
      switch (s) {
        case "none": {
          downloadTranslateY.value = 0;
          loadingTranslateY.value = 0;
          doneTranslateY.value = 0;
          loadingIconTranslateY.value = 0;
          loadingIconOpacity.value = 1;
          doneIconWiggle.value = 0;

          break;
        }
        case "downloading": {
          downloadTranslateY.value = withSequence(
            withTiming(BUTTON_HEIGHT),
            withTiming(-BUTTON_HEIGHT, { duration: 0 })
          );
          loadingTranslateY.value = withTiming(BUTTON_HEIGHT);

          const repeat = (value: number) => {
            return withRepeat(withTiming(value, { duration: 800 }), -1, true);
          };
          loadingIconTranslateY.value = repeat(5);
          loadingIconOpacity.value = repeat(0.1);

          break;
        }
        case "success": {
          loadingTranslateY.value = withTiming(2 * BUTTON_HEIGHT);

          doneTranslateY.value = withTiming(BUTTON_HEIGHT, undefined, () => {
            doneIconWiggle.value = withDelay(
              200,
              withSequence(
                withTiming(-10, { duration: 100 }),
                withTiming(10, { duration: 100 }),
                withTiming(0, { duration: 100 }, () => {
                  doneTranslateY.value = withDelay(
                    1000,
                    withTiming(2 * BUTTON_HEIGHT)
                  );
                  downloadTranslateY.value = withDelay(
                    1000,
                    withTiming(0, undefined, () => runOnJS(setStatus)("none"))
                  );
                })
              )
            );
          });

          break;
        }
        case "failed": {
          break;
        }
      }
    },
    [status]
  );

  const downloadAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: downloadTranslateY.value }],
    };
  });

  const loadingAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: loadingTranslateY.value }],
    };
  });

  const doneAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: doneTranslateY.value }],
    };
  });

  const loadingIconAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: loadingIconTranslateY.value }],
      opacity: loadingIconOpacity.value,
    };
  });

  const doneIconAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${doneIconWiggle.value}deg` }],
    };
  });

  return (
    <Pressable
      style={{
        width: BUTTON_WIDTH,
        height: BUTTON_HEIGHT,
        borderRadius: 10,
        overflow: "hidden",
      }}
      onPress={() => {
        if (status === "none") {
          setStatus("downloading");
          setTimeout(() => {
            cancelAnimation(loadingIconTranslateY);
            cancelAnimation(loadingIconOpacity);
            setStatus("success");
          }, 4000);
        }
      }}
    >
      {/* Download */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.SurfaceCritical,
          },
          downloadAStyle,
        ]}
      >
        <Text
          style={{
            color: Colors.TextOnSurfaceNeutral,
            fontWeight: "700",
            fontSize: 16,
          }}
        >
          Download
        </Text>
      </Animated.View>

      {/* Loading */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -BUTTON_HEIGHT,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.IconSuccess,
          },
          loadingAStyle,
        ]}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 24,
            height: BUTTON_HEIGHT,
            marginRight: Spacing.s,
          }}
        >
          <Animated.View
            style={[{ position: "absolute", top: 5 }, loadingIconAStyle]}
          >
            <MaterialCommunityIcons
              name="arrow-down"
              size={20}
              color={Colors.IconOnPrimary}
            />
          </Animated.View>
          <MaterialCommunityIcons
            name="tray"
            size={24}
            color={Colors.IconOnPrimary}
            style={{ position: "absolute", top: 15, marginLeft: 1 }}
          />
        </View>
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          Loading
        </Text>
      </Animated.View>

      {/* Done */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: -BUTTON_HEIGHT,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: Colors.ActionPrimary,
          },
          doneAStyle,
        ]}
      >
        <Animated.View style={doneIconAStyle}>
          <MaterialIcons
            name="file-download-done"
            size={20}
            color={Colors.IconOnPrimary}
          />
        </Animated.View>
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontSize: 16,
            fontWeight: "700",
            marginLeft: Spacing.m,
          }}
        >
          Done
        </Text>
      </Animated.View>
    </Pressable>
  );
};
