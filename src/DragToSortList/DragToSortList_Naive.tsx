import React from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors, snapPoints, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

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
  "aasdfas",
];

export const DragToSortList: React.FC = () => {
  const dragAbsY = useSharedValue(0);
  const dragIndex = useSharedValue(-1);

  return (
    <Animated.ScrollView
      style={{ backgroundColor: Colors.SurfaceForegroundPressed }}
      contentContainerStyle={{
        backgroundColor: Colors.SurfaceForegroundPressed,
      }}
    >
      {DATA.map((val, index) => (
        <Row
          key={val}
          index={index}
          title={val}
          dragAbsY={dragAbsY}
          dragIndex={dragIndex}
        />
      ))}
    </Animated.ScrollView>
  );
};

const ROW_HEIGHT = 60;
const SNAP_POINTS = DATA.map((_, index) => [
  index * ROW_HEIGHT,
  -index * ROW_HEIGHT,
]).flat();

// This approach to use offsetY translations worked really well, but ran into one major problem:
// It could NOT handle consecutive pan gesture translations. Basically, when initially loaded, and a row was dragged the very first time,
// the other non-drag rows would translate perfectly. However, when a different row was dragged afterwards, the non-drag rows would translate
// incorrectly. This is because we are relying heavily on the initial index to do our translation calculations. If we didn't re-update the state,
// then indexes wouldn't update. But re-updating meant calling setState - and there's frankly no need to do a state update - it also introduced
// even more complexity to do this.

const Row = ({
  index,
  title,
  dragIndex,
  dragAbsY,
}: {
  index: number;
  title: string;
  dragAbsY: Animated.SharedValue<number>;
  dragIndex: Animated.SharedValue<number>;
}) => {
  // Values for handling the non-dragging rows
  const offsetY = useSharedValue(0);
  const dragStartAbsY = useDerivedValue(() => dragIndex.value * ROW_HEIGHT);

  // Values for handling the dragging row
  const dragStartOffsetY = useSharedValue(0);
  const dragOffsetY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const zIndex = useSharedValue(0);
  const hapticed = useSharedValue(false);

  const provideHapticFeedback = (insideZone: boolean) => {
    "worklet";

    if (insideZone) {
      if (!hapticed.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        hapticed.value = true;
      }
    } else {
      if (hapticed.value) {
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        hapticed.value = false;
      }
    }
  };

  // Observe dragAbsY value (produced from the dragging row pan gesture) and animate up/down the other rows
  useAnimatedReaction(
    () => dragAbsY.value,
    (dragEndPos) => {
      if (dragIndex.value === index || dragIndex.value === -1) return;

      const dragStartPos = dragStartAbsY.value;
      const dragDelta = dragStartPos - dragEndPos;

      // Moved drag row up, so move my (index) row down
      // Drag row is moving ABOVE the initial drag row starting position, regardless of whether it's up or down
      if (dragDelta > 0) {
        // Determine the position where the row is deemed to be within the dragged zone
        const rowActivePos = index * ROW_HEIGHT + ROW_HEIGHT / 2;
        const isRowInsideDraggedZone =
          dragEndPos <= rowActivePos && dragStartPos >= rowActivePos;

        // If the row is positioned inside the drag zone, then move it down; Else, move it back to origin
        if (isRowInsideDraggedZone) {
          offsetY.value = withTiming(ROW_HEIGHT);
        } else {
          offsetY.value = withTiming(0);
        }

        provideHapticFeedback(isRowInsideDraggedZone);
      }
      // Moved drag row down, so move my (index) row up
      // Drag row is moving BELOW the initial drag row starting position, regardless of whether it's up or down
      else {
        // Determine the position where the row is deemed to be within the dragged zone
        const rowActivePos = index * ROW_HEIGHT - ROW_HEIGHT / 2;
        const isRowInsideDraggedZone =
          dragStartPos <= rowActivePos && dragEndPos >= rowActivePos;

        // If the row is positioned inside the drag zone, then move it up; Else, move it back to origin
        if (isRowInsideDraggedZone) {
          offsetY.value = withTiming(-ROW_HEIGHT);
        } else {
          offsetY.value = withTiming(0);
        }

        provideHapticFeedback(isRowInsideDraggedZone);
      }
    }
  );

  // Pan gesture handler for the dragging row
  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragging.value = true;
      dragIndex.value = index;
      dragStartOffsetY.value = dragOffsetY.value;
      zIndex.value = 1;
    })
    .onUpdate((e) => {
      dragOffsetY.value = dragStartOffsetY.value + e.translationY;
      dragAbsY.value = dragStartAbsY.value + dragOffsetY.value;
    })
    .onEnd(() => {
      const snapToPoint = (p: number) => {
        "worklet";
        dragOffsetY.value = withTiming(p, undefined, () => {
          dragging.value = false;
          zIndex.value = 0;
        });
      };

      let snapPoint = snapPoints(dragOffsetY.value, 0, SNAP_POINTS);

      if (dragOffsetY.value >= (DATA.length - index - 1) * ROW_HEIGHT) {
        // Drag row is outside bottom list bounds
        snapPoint = (DATA.length - index - 1) * ROW_HEIGHT;
      } else if (dragOffsetY.value <= -index * ROW_HEIGHT) {
        // Drag row is outside top list bounds
        snapPoint = -index * ROW_HEIGHT;
      }

      snapToPoint(snapPoint);
    });

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY:
            dragIndex.value === index ? dragOffsetY.value : offsetY.value,
        },
      ],
      shadowOpacity: dragging.value ? 0.5 : 0,
      zIndex: zIndex.value,
    };
  });

  return (
    <Animated.View
      style={[
        {
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
            {`Docusaurus ${index}`}
          </Text>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>{title}</Text>
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
