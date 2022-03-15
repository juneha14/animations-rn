import React from "react";
import { StyleProp, ViewStyle, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolate,
  useDerivedValue,
} from "react-native-reanimated";
import { Palette, Spacing, Colors } from "../utils";

interface SectionProps {
  headerTitle: string;
  headerLeftIcon?: JSX.Element;
  showHeaderDivider?: boolean;
  scrollY: Animated.SharedValue<number>;
  initialPosition?: number;
  style?: StyleProp<ViewStyle>;
}

export const Section: React.FC<SectionProps> = ({
  headerTitle,
  headerLeftIcon,
  showHeaderDivider = false,
  scrollY,
  initialPosition,
  style,
  children,
}) => {
  const containerPosition = useSharedValue(0);
  const origin = useDerivedValue(() => {
    return initialPosition ?? containerPosition.value;
  }, [initialPosition]);

  const headerSize = useSharedValue(0);
  const contentSize = useSharedValue(0);

  const containerAStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [origin.value, origin.value + contentSize.value],
      [0, contentSize.value],
      { extrapolateLeft: "clamp", extrapolateRight: "extend" }
    );

    const opacity = interpolate(
      scrollY.value,
      [
        origin.value + contentSize.value,
        origin.value + contentSize.value + Spacing.m,
        origin.value + contentSize.value + headerSize.value,
      ],
      [1, 0.7, 0],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
      opacity,
    };
  });

  const sectionHeaderAStyle = useAnimatedStyle(() => {
    const borderBottomRadius = interpolate(
      scrollY.value,
      [origin.value, origin.value + contentSize.value],
      [0, 10],
      Extrapolate.CLAMP
    );

    return {
      borderBottomLeftRadius: borderBottomRadius,
      borderBottomRightRadius: borderBottomRadius,
    };
  });

  const contentAStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [origin.value, origin.value + contentSize.value],
      [0, -contentSize.value],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          borderRadius: 10,
          overflow: "hidden",
        },
        style,
        containerAStyle,
      ]}
      onLayout={(e) => {
        // origin.value = e.nativeEvent.layout.y;
        containerPosition.value = e.nativeEvent.layout.y;
      }}
    >
      {/* Section Header */}
      <Animated.View
        style={[
          {
            paddingVertical: 2,
            zIndex: 1,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: Palette.Blue.Primary,
          },
          sectionHeaderAStyle,
        ]}
        onLayout={(e) => {
          headerSize.value = e.nativeEvent.layout.height;
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.m,
            marginHorizontal: 12,
          }}
        >
          {headerLeftIcon ? headerLeftIcon : null}
          <Text
            style={{
              color: Colors.SurfaceForegroundPressed,
              fontWeight: "500",
              marginLeft: headerLeftIcon ? 5 : 0,
            }}
          >
            {headerTitle.toUpperCase()}
          </Text>
        </View>
      </Animated.View>

      {/* Section content */}
      <Animated.View
        style={[
          {
            flex: 1,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            backgroundColor: Palette.Blue.Primary,
          },
          contentAStyle,
        ]}
        onLayout={(e) => {
          contentSize.value = e.nativeEvent.layout.height;
        }}
      >
        <>
          {showHeaderDivider ? (
            <View
              style={{
                height: 0.5,
                marginLeft: 12,
                backgroundColor: Colors.BorderSubdued,
              }}
            />
          ) : null}
          {children}
        </>
      </Animated.View>
    </Animated.View>
  );
};
