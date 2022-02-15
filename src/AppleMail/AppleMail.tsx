import React from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import { Colors, snapPoints, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

// Vertical scroll not working when scrolling within row
// Multiple action row buttons
// Search bar scale animation
// Rearrange rows

export const AppleMail: React.FC = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.SurfaceForeground }}
      contentContainerStyle={{
        paddingVertical: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceForeground,
      }}
    >
      <Header />
      {[...Array(10).keys()].map((val) => {
        return <Row key={val} val={val} />;
      })}
    </ScrollView>
  );
};

const { width } = Dimensions.get("window");
const SNAP_POINTS = [0, -80 * 3, -width * 0.95];

const Row = ({ val }: { val: number }) => {
  const startOffsetX = useSharedValue(0);
  const offsetX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .averageTouches(true)
    .onStart(() => {
      startOffsetX.value = offsetX.value;
    })
    .onUpdate((e) => {
      offsetX.value = startOffsetX.value + e.translationX;
    })
    .onEnd((e) => {
      const snapPoint = snapPoints(offsetX.value, e.velocityX, SNAP_POINTS);
      offsetX.value = withTiming(snapPoint);
    });

  const aStyle = useAnimatedStyle(() => {
    const translateX = Math.min(offsetX.value, 0);

    return {
      transform: [
        {
          translateX: translateX,
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={{ flexDirection: "row" }}>
        {/* Row content container */}
        <View>
          {/* Divider */}
          <View
            style={{
              height: 1,
              marginLeft: Spacing.xl,
              backgroundColor: Colors.BorderSubdued,
            }}
          />

          {/* Content container */}
          <Animated.View
            style={[
              {
                paddingVertical: Spacing.m,
                paddingRight: Spacing.l,
                paddingLeft: Spacing.xl,
              },
              aStyle,
            ]}
          >
            {/* Contact and date */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: 17,
                }}
              >{`John Doe ${val}`}</Text>
              <Text style={{ color: Colors.TextSubdued }}>Friday</Text>
            </View>

            {/* Mail title and content preview */}
            <View>
              <Text
                style={{
                  fontSize: 15,
                  marginBottom: 5,
                  color: Colors.TextNeutral,
                }}
              >
                Money Team Update: January 2022
              </Text>
              <Text
                style={{ color: Colors.TextSubdued, fontSize: 15 }}
                numberOfLines={2}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* Row action button container */}
        <RowActionButton offsetX={offsetX} type="more" index={2} />
        <RowActionButton offsetX={offsetX} type="move" index={1} />
        <RowActionButton offsetX={offsetX} type="trash" index={0} />
      </View>
    </GestureDetector>
  );
};

const RowActionButton = ({
  offsetX,
  type,
  index,
}: {
  offsetX: Animated.SharedValue<number>;
  index: number;
  type: keyof typeof RowActions;
}) => {
  const aStyle = useAnimatedStyle(() => {
    const inputRange = [SNAP_POINTS[2], SNAP_POINTS[1], SNAP_POINTS[0]];

    const scaleFactor = Math.abs(SNAP_POINTS[2] / SNAP_POINTS[1]);

    const width = interpolate(
      offsetX.value,
      inputRange,
      [80 * (index + 1) * scaleFactor, 80 * (index + 1), 0]
      //   Extrapolate.CLAMP
    );

    return {
      width,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          right: 0,
          justifyContent: "center",
          width: 80,
          height: "100%",
          backgroundColor: RowActions[type].color,
        },
        aStyle,
      ]}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          width: 80,
        }}
      >
        <Ionicons
          name={RowActions[type].icon as keyof typeof Ionicons.glyphMap}
          color={Colors.TextOnSurfacePrimary}
          size={24}
        />
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontWeight: "600",
            fontSize: 15,
          }}
        >
          {RowActions[type].name}
        </Text>
      </View>
    </Animated.View>
  );
};

const RowActions = {
  trash: {
    name: "Trash",
    color: "red",
    icon: "ios-trash-outline",
  },
  move: {
    name: "Move",
    color: "indigo",
    icon: "ios-folder-outline",
  },
  more: {
    name: "More",
    color: "grey",
    icon: "ellipsis-horizontal-circle-outline",
  },
};

const Header = () => {
  return (
    <View style={{ paddingHorizontal: Spacing.xl, marginBottom: Spacing.m }}>
      <Text style={{ fontWeight: "700", fontSize: 30 }}>Inbox</Text>
      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 5,
          paddingVertical: 8,
          borderRadius: 10,
          marginTop: Spacing.m,
          marginLeft: -10,
          backgroundColor: Colors.SurfaceBackgroundPressed,
        }}
      >
        <Ionicons
          name="ios-search-outline"
          size={20}
          color={Colors.IconNeutral}
          style={{ marginRight: Spacing.s }}
        />
        <Text style={{ color: Colors.TextSubdued, fontSize: 16 }}>Search</Text>
      </View>
    </View>
  );
};
