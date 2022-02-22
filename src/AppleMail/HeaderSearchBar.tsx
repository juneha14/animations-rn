import React from "react";
import { Text } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import { SEARCH_BAR_HEIGHT } from "./utils";

export const HeaderSearchBar = ({
  scrollY,
}: {
  scrollY: Animated.SharedValue<number>;
}) => {
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SEARCH_BAR_HEIGHT + Spacing.m],
            [0, SEARCH_BAR_HEIGHT + Spacing.m], // offset y translation so that it stays in place until search bar disappears
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  /* Using a combination of translate and scale seems to be the way to do these type of animations where
   * a view is interpolated from a scroll position (see Twitter profile image view for a similar example).
   *
   * Simply interpolating the view's height does NOT work - it creates a weird 'laggy' animation whenever
   * we scroll back up to the top.
   */
  const searchBarContainerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, SEARCH_BAR_HEIGHT],
            [0, SEARCH_BAR_HEIGHT / 2],
            Extrapolate.CLAMP
          ),
        },
        {
          scaleY: interpolate(
            scrollY.value,
            [0, SEARCH_BAR_HEIGHT],
            [1, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  const searchBarContentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 10], [1, 0], Extrapolate.CLAMP),
    };
  });

  return (
    <>
      <Animated.View
        style={[{ paddingHorizontal: Spacing.xl }, headerAnimatedStyle]}
      >
        <Text style={{ fontWeight: "700", fontSize: 30 }}>Inbox</Text>
      </Animated.View>

      {/* Search bar */}
      <Animated.View
        style={[
          {
            justifyContent: "center",
            height: SEARCH_BAR_HEIGHT,
            marginVertical: Spacing.m,
            marginHorizontal: Spacing.xl - 10,
            borderRadius: 10,
            backgroundColor: Colors.SurfaceBackgroundPressed,
          },
          searchBarContainerAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 5,
            },
            searchBarContentAnimatedStyle,
          ]}
        >
          <Ionicons
            name="ios-search-outline"
            size={20}
            color={Colors.IconNeutral}
            style={{ marginRight: Spacing.s }}
          />
          <Text style={{ color: Colors.TextSubdued, fontSize: 16 }}>
            Search
          </Text>
        </Animated.View>
      </Animated.View>
    </>
  );
};
