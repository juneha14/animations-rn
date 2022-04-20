import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { clamp, Colors, Spacing } from "../utils";
import { EvilIcons } from "@expo/vector-icons";

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(true);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = clamp(e.translationX, -64, 64);
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
    });

  const increment = (completion?: () => void) => {
    "worklet";
    translateY.value = withDelay(
      completion ? 300 : 0,
      withTiming(-80, undefined, () => {
        translateY.value = withSequence(
          withTiming(80, { duration: 0 }),
          withTiming(0, undefined, () => {
            completion && completion();
          })
        );

        runOnJS(setCount)(count + 1);
      })
    );
  };

  const decrement = (completion?: () => void) => {
    "worklet";
    translateY.value = withDelay(
      completion ? 300 : 0,
      withTiming(80, undefined, () => {
        translateY.value = withSequence(
          withTiming(-80, { duration: 0 }),
          withTiming(0, undefined, () => {
            completion && completion();
          })
        );

        runOnJS(setCount)(count - 1);
      })
    );
  };

  useAnimatedReaction(
    () => translateX.value,
    (x) => {
      // Increment
      if (x > 30 && x < 60) {
        if (isAnimationComplete) {
          runOnJS(setIsAnimationComplete)(false);
          increment(() => {
            runOnJS(setIsAnimationComplete)(true);
          });
        }
      } else if (x > 60) {
        increment();
      }
      // Decrement
      else if (x < -30 && x > -60) {
        if (isAnimationComplete) {
          runOnJS(setIsAnimationComplete)(false);
          decrement(() => {
            runOnJS(setIsAnimationComplete)(true);
          });
        }
      } else if (x < -60) {
        decrement();
      }
    },
    [count, isAnimationComplete]
  );

  const counterAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const counterTextAStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.SurfaceBackground }}
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable onPress={() => decrement()}>
          <EvilIcons name="minus" size={40} color={Colors.IconNeutral} />
        </Pressable>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 80,
                marginHorizontal: Spacing.xl,
                borderRadius: 10,
                backgroundColor: Colors.SurfaceHighlight,
                zIndex: 1,
                overflow: "hidden",
              },
              counterAStyle,
            ]}
          >
            <Animated.Text
              style={[
                { fontSize: 25, color: Colors.TextOnSurfaceHighlight },
                counterTextAStyle,
              ]}
            >
              {count}
            </Animated.Text>
          </Animated.View>
        </GestureDetector>

        <Pressable onPress={() => increment()}>
          <EvilIcons name="plus" size={40} color={Colors.IconNeutral} />
        </Pressable>
      </View>
    </ScrollView>
  );
};
