import React from "react";
import {
  View,
  Pressable,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  useAnimatedProps,
} from "react-native-reanimated";
import { Colors } from "../utils";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useNavBarHeightProvider, Images } from "./utils/utils";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
const { width } = Dimensions.get("window");

interface NavigationHeaderProps {
  offsetY: Animated.SharedValue<number>;
  usernameDimensions: Animated.SharedValue<{ height: number; y: number }>;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  offsetY,
  usernameDimensions,
}) => {
  const { NAV_BAR_MAX_HEIGHT, NAV_BAR_MIN_HEIGHT } = useNavBarHeightProvider();
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const bannerImageAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      offsetY.value,
      [0, NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT],
      [0, -(NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT)],
      Extrapolate.CLAMP
    );

    const scale = interpolate(offsetY.value, [-200, 0], [4, 1], {
      extrapolateLeft: "extend",
      extrapolateRight: "clamp",
    });

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      usernameDimensions.value.y + 2,
      usernameDimensions.value.y + 2 + usernameDimensions.value.height,
    ];

    const translateY = interpolate(
      offsetY.value,
      inputRange,
      [33, 0], // Just played around with this value until we got a smooth animation
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      offsetY.value,
      inputRange,
      [0, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY: translateY }],
      opacity,
    };
  });

  //   const blurAnimatedStyle = useAnimatedStyle(() => {
  //     const inputRange = [
  //       -65,
  //       0,
  //       usernameDimensions.value.y + 2,
  //       usernameDimensions.value.y + 2 + usernameDimensions.value.height,
  //     ];
  //     const outputRange = [1, 0, 0.7, 1];

  //     return {
  //       opacity: interpolate(offsetY.value, inputRange, outputRange),
  //     };
  //   });

  // Using blurAnimatedProps should be the way to go. It produces the right smooth blurring effect, more so than just controlling its opacity
  // However, using animatedProps causes a 'Too many pending callbacks. Memory limit exceeded' error.
  const blurAnimatedProps = useAnimatedProps(() => {
    const inputRange = [
      -80,
      0,
      usernameDimensions.value.y + 2,
      usernameDimensions.value.y + 2 + usernameDimensions.value.height,
    ];

    return {
      intensity: interpolate(
        offsetY.value,
        inputRange,
        [60, 0, 0, 60],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <View
      style={{
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
      }}
    >
      <AnimatedImageBackground
        style={[
          {
            width: width,
            height: NAV_BAR_MAX_HEIGHT,
          },
          bannerImageAnimatedStyle,
        ]}
        source={Images.header}
      >
        <AnimatedBlurView
          style={[{ ...StyleSheet.absoluteFillObject }]}
          animatedProps={blurAnimatedProps}
          tint="dark"
          //   intensity={60}
        />
      </AnimatedImageBackground>

      <View
        style={{
          position: "absolute",
          top: top,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: width,
          height: 40,
          paddingHorizontal: 10,
        }}
      >
        <Pressable onPress={() => goBack()}>
          <Ionicons name="arrow-back-circle" size={38} />
        </Pressable>

        <Animated.Text
          style={[
            {
              color: Colors.TextOnSurfacePrimary,
              fontWeight: "bold",
              fontSize: 18,
            },
            titleAnimatedStyle,
          ]}
        >
          Docusaurus
        </Animated.Text>

        <Pressable>
          <Ionicons name="search-circle" size={38} />
        </Pressable>
      </View>
    </View>
  );
};
