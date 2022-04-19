import React, { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import { EvilIcons } from "@expo/vector-icons";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      translateX.value = withTiming(0);
    });

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
          overflow: "hidden",
        }}
      >
        <Pressable
          onPress={() => {
            translateY.value = withTiming(80, undefined, () => {
              translateY.value = withSequence(
                withTiming(-80, { duration: 0 }),
                withTiming(0)
              );

              runOnJS(setCount)(count - 1);
            });
          }}
        >
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

        <Pressable
          onPress={() => {
            translateY.value = withTiming(-80, undefined, () => {
              translateY.value = withSequence(
                withTiming(80, { duration: 0 }),
                withTiming(0)
              );

              runOnJS(setCount)(count + 1);
            });
          }}
        >
          <EvilIcons name="plus" size={40} color={Colors.IconNeutral} />
        </Pressable>
      </View>
    </ScrollView>
  );
};
