import React from "react";
import { Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette } from "../../utils";

export const Header = ({
  scrollY,
}: {
  scrollY: Animated.SharedValue<number>;
}) => {
  const { top } = useSafeAreaInsets();

  const headerAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-150, 0, 150],
            [30, 0, -30],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const currentTempAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [95, 120], [1, 0]),
    };
  });

  const highLowTempAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 120], [1, 0]),
    };
  });

  const forecastSummaryAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [120, 150], [0, 1]),
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: top + 50,
          zIndex: 1,
        },
        headerAStyle,
      ]}
    >
      <Text style={{ color: Palette.White, fontSize: 35 }}>
        Greater Vancouver
      </Text>

      <Animated.Text
        style={[{ color: Palette.White, fontSize: 18 }, forecastSummaryAStyle]}
      >
        4° | Mostly Sunny
      </Animated.Text>

      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginTop: -25,
        }}
      >
        <Animated.Text
          style={[
            {
              color: Palette.White,
              fontSize: 90,
              fontWeight: "200",
              marginVertical: -10,
              marginLeft: 10,
            },
            currentTempAStyle,
          ]}
        >
          4°
        </Animated.Text>

        <Animated.View
          style={[
            { justifyContent: "center", alignItems: "center" },
            highLowTempAStyle,
          ]}
        >
          <Text
            style={{ color: Palette.White, fontSize: 20, fontWeight: "500" }}
          >
            Mostly Sunny
          </Text>
          <Text
            style={{ color: Palette.White, fontSize: 20, fontWeight: "500" }}
          >
            H: 7° L: 2°
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};
