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
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { clamp } from "../utils/redash";

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

export const DragToSortList2: React.FC = () => {
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
    })
    .onUpdate((e) => {
      const absY = e.absoluteY - NAV_BAR_HEIGHT;
      top.value = withTiming(absY, { duration: 16 });

      // Update positions of other non-dragging rows
      const currentIndex = rowState.value[id];
      const newIndex = clamp(Math.floor(absY / ROW_HEIGHT), 0, DATA.length - 1);
      if (newIndex !== currentIndex) {
        rowState.value = updateRowPositionIndex(currentIndex, newIndex);
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
