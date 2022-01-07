import React, { useState } from "react";
import { StyleSheet, Dimensions } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Switch } from "react-native-gesture-handler";

type Theme = "light" | "dark";

export const InterpolateColors: React.FC = () => {
  const [theme, setTheme] = useState<Theme>("light");

  const progress = useDerivedValue(() => {
    // withTiming allows us to smoothly animate values between 0 and 1
    return withTiming(theme === "dark" ? 1 : 0);
  }, [theme]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background]
    );
    return {
      backgroundColor,
    };
  });

  const circleAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.circle, Colors.dark.circle]
    );
    return {
      backgroundColor,
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.text, Colors.dark.text]
    );
    return {
      color: textColor,
    };
  });

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Animated.Text style={[styles.text, textAnimatedStyle]}>
        THEME
      </Animated.Text>
      <Animated.View style={[styles.circle, circleAnimatedStyle]}>
        <Switch
          value={theme === "dark"}
          onValueChange={(isToggled) => setTheme(isToggled ? "dark" : "light")}
          trackColor={SWITCH_TRACK_COLOR}
          thumbColor="violet"
        />
      </Animated.View>
    </Animated.View>
  );
};

const SIZE = Dimensions.get("window").width * 0.8;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZE / 2,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    elevation: 8,
  },
  text: {
    fontSize: 50,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});

const Colors = {
  light: {
    background: "#f8f8f8",
    circle: "#fff",
    text: "#1e1e1e",
  },
  dark: {
    background: "#1e1e1e",
    circle: "#252525",
    text: "#f8f8f8",
  },
};

const SWITCH_TRACK_COLOR = {
  true: "rgba(256, 0, 256, 0.2)",
  false: "rgba(256, 0, 0, 0.1)",
};
