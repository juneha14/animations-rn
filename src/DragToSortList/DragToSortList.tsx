import React from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors, Spacing, clamp } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

export const DragToSortList: React.FC = () => {
  const rowState = useSharedValue<State>(createInitialState());

  return (
    <Animated.ScrollView
      style={{ backgroundColor: Colors.SurfaceForegroundPressed }}
      contentContainerStyle={{
        backgroundColor: Colors.SurfaceForegroundPressed,
      }}
    >
      {DATA.map((val, index) => (
        <Row key={val} initialIndex={index} id={val} rowState={rowState} />
      ))}
    </Animated.ScrollView>
  );
};

const Row = ({
  initialIndex,
  id,
  rowState,
}: {
  initialIndex: number;
  id: string;
  rowState: Animated.SharedValue<State>;
}) => {
  const top = useSharedValue(rowState.value[id] * ROW_HEIGHT);

  const dragging = useSharedValue(false);
  const startDragPosition = useSharedValue(0);

  // Swap the position index of the dragging row from initial to target index
  // Swapping the dragged row index is going to in turn swap the non-drag (target index) row to the previous dragged row index
  const updateRowPositionIndex = (from: number, to: number) => {
    "worklet";

    const newState = Object.assign({}, rowState.value);
    Object.entries(rowState.value).forEach(([id, idx]) => {
      if (idx === from) {
        newState[id] = to;
      }
      if (idx === to) {
        newState[id] = from;
      }
    });

    return newState;
  };

  // Animate other non-dragging rows based on the index-swapping calculations done by the dragging row gesture
  useAnimatedReaction(
    () => rowState.value[id],
    (currIndex, prevIndex) => {
      if (currIndex !== prevIndex && prevIndex !== null) {
        if (!dragging.value) {
          top.value = withTiming(currIndex * ROW_HEIGHT);
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        }
      }
    }
  );

  // Pan gesture handler for the dragging row
  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragging.value = true;
      startDragPosition.value = rowState.value[id] * ROW_HEIGHT;
    })
    .onUpdate((e) => {
      // Update position of dragging row to follow pan gesture
      const absY = e.absoluteY - NAV_BAR_HEIGHT;
      top.value = withTiming(absY, { duration: 16 });

      // Calculate current y position of the dragged row
      // Since our rows are positioned absolutely, when we change its top position, its translateY offset will be reset to 0
      // So offsetY is not a cumulation from the initial starting position
      const offsetY = e.translationY;
      const y = startDragPosition.value + offsetY + ROW_HEIGHT / 2 + 5;

      // Update positions of other non-dragging rows
      const currentIndex = rowState.value[id];
      const nextIndex = clamp(Math.floor(y / ROW_HEIGHT), 0, DATA.length - 1);
      if (nextIndex !== currentIndex) {
        rowState.value = updateRowPositionIndex(currentIndex, nextIndex);
      }
    })
    .onEnd(() => {
      top.value = withTiming(rowState.value[id] * ROW_HEIGHT, undefined, () => {
        dragging.value = false;
      });
    });

  const aStyle = useAnimatedStyle(() => {
    return {
      top: top.value,
      zIndex: dragging.value ? 1 : 0,
      shadowOpacity: dragging.value ? 0.5 : 0,
      opacity: dragging.value ? 0.7 : 1,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: 0,
          right: 0,
          shadowRadius: 2,
          shadowColor: "#171717",
          shadowOffset: { height: 0, width: 0 },
          backgroundColor: Colors.SurfaceForeground,
        },
        aStyle,
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: ROW_HEIGHT,
          paddingHorizontal: Spacing.defaultMargin,
        }}
      >
        <Image
          source={Images.profile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderColor: Colors.BorderSubdued,
            borderWidth: 1,
          }}
        />
        <View style={{ flex: 1, marginLeft: Spacing.l }}>
          <Text
            style={{
              color: Colors.TextNeutral,
              fontSize: 14,
              marginBottom: 2,
            }}
          >
            {`Docusaurus ${initialIndex}`}
          </Text>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>{id}</Text>
        </View>

        <GestureDetector gesture={panGesture}>
          <View>
            <Ionicons
              name="ios-menu-outline"
              size={25}
              color={Colors.IconSubdued}
            />
          </View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
};

const Images = {
  profile: require("../../assets/docusaurus.png"),
};

const DATA = [
  "arrive-client",
  "ios",
  "pos-next-react-native",
  "media-db-rn",
  "animations-rn",
  "memory-matching-game-rn",
  "balance-mobile",
  "android",
  "shopify",
  "hydrogren",
  "oxygen",
  "reanimated",
];

const ROW_HEIGHT = 60;
const NAV_BAR_HEIGHT = 111;

type State = Record<string, number>;

const createInitialState = () => {
  const posIdxForId: State = {};
  DATA.forEach((val, index) => {
    posIdxForId[val] = index;
  });
  return posIdxForId;
};
