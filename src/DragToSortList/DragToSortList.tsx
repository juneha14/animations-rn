import React from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  RotationGestureHandler,
} from "react-native-gesture-handler";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

export const DragToSortList: React.FC = () => {
  const absY = useSharedValue(0);
  const velY = useSharedValue(0);
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
          absY={absY}
          velY={velY}
          dragIndex={dragIndex}
          onBeginDrag={() => {
            dragIndex.value = index;
          }}
        />
      ))}
    </Animated.ScrollView>
  );
};

const ROW_HEIGHT = 60;
const NAV_BAR_HEIGHT = 111;

// onEnd gesture should snap the dragged row into proper position
// onEnd gesture for dragged row outside the view's bounds should snap into position
// scrolling row

const Row = ({
  index,
  title,
  absY,
  velY,
  dragIndex,
  onBeginDrag,
}: {
  index: number;
  title: string;
  absY: Animated.SharedValue<number>;
  velY: Animated.SharedValue<number>;
  dragIndex: Animated.SharedValue<number>;
  onBeginDrag: () => void;
}) => {
  const activeRange = [index * ROW_HEIGHT, (index + 1) * ROW_HEIGHT];
  const offsetY = useSharedValue(0);

  const dragStartY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const zIndex = useSharedValue(0);

  useAnimatedReaction(
    () => Math.abs(absY.value - NAV_BAR_HEIGHT),
    (y) => {
      if (dragIndex.value === index || dragIndex.value === -1) return;

      const dragStartPos = dragIndex.value * ROW_HEIGHT;
      const dragEndPos = y;
      const dragDelta = dragStartPos - dragEndPos;

      const rowMidPos = activeRange[0] + ROW_HEIGHT / 2;

      // Moved drag row up, so move my (index) row down
      if (dragDelta > 0) {
        const isRowInsideDraggedZone =
          dragEndPos <= rowMidPos && dragStartPos >= rowMidPos;

        if (isRowInsideDraggedZone) {
          offsetY.value = withTiming(ROW_HEIGHT);
        } else {
          offsetY.value = withTiming(0);
        }
      }
      // Moved drag row down, so move my (index) row up
      else {
        const isRowInsideDraggedZone =
          dragStartPos <= rowMidPos && dragEndPos >= rowMidPos;

        if (isRowInsideDraggedZone) {
          offsetY.value = withTiming(-ROW_HEIGHT);
        } else {
          offsetY.value = withTiming(0);
        }
      }
    }
  );

  //   useAnimatedReaction(
  //     () => Math.abs(absY.value - NAV_BAR_HEIGHT),
  //     (y) => {
  //       if (dragIndex.value === index || dragIndex.value === -1) return;

  //       const top = activeRange[0] + offsetY.value;
  //       const bottom = activeRange[1] + offsetY.value;
  //       const mid = top + ROW_HEIGHT / 2;

  //       if (y >= top && y <= bottom) {
  //         if (velY.value > 0) {
  //           // Moving down
  //           if (y + ROW_HEIGHT > mid) {
  //             if (offsetY.value === 0) {
  //               offsetY.value = withTiming(-ROW_HEIGHT);
  //             } else if (offsetY.value === ROW_HEIGHT) {
  //               offsetY.value = withTiming(0);
  //             }
  //           }
  //         } else {
  //           // Moving up
  //           if (y <= mid) {
  //             if (offsetY.value === 0) {
  //               offsetY.value = withTiming(ROW_HEIGHT);
  //             } else if (offsetY.value === -ROW_HEIGHT) {
  //               offsetY.value = withTiming(0);
  //             }
  //           }
  //         }
  //       } else {
  //         if (velY.value < -500) {
  //           // Dragged up very quickly
  //           console.log(
  //             "========== File: DragToSortList.tsx, Line: 118 =========="
  //           );
  //           if (y < mid) {
  //             if (offsetY.value === 0) {
  //               offsetY.value = withTiming(ROW_HEIGHT, { duration: 100 });
  //             } else if (offsetY.value === -ROW_HEIGHT) {
  //               offsetY.value = withTiming(0, { duration: 100 });
  //             }
  //           }
  //         } else if (velY.value > 500) {
  //           console.log(
  //             "========== File: DragToSortList.tsx, Line: 126 =========="
  //           );
  //           // Dragged down very quickly
  //           if (y < mid) {
  //             if (offsetY.value === 0) {
  //               offsetY.value = withTiming(-ROW_HEIGHT, { duration: 100 });
  //             } else if (offsetY.value === ROW_HEIGHT) {
  //               offsetY.value = withTiming(0, { duration: 100 });
  //             }
  //           }
  //         }
  //       }
  //     }
  //   );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      dragStartY.value = dragY.value;
      dragging.value = true;
      zIndex.value = 1;
      runOnJS(onBeginDrag)();
    })
    .onUpdate((e) => {
      absY.value = e.absoluteY;
      velY.value = e.velocityY;

      dragY.value = dragStartY.value + e.translationY;
    })
    .onEnd(() => {
      dragY.value = withTiming(0, { duration: 300 }, () => {
        zIndex.value = 0;
      });
      dragging.value = false;
    });

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: dragIndex.value === index ? dragY.value : offsetY.value,
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
              color={Colors.IconNeutral}
            />
          </View>
        </GestureDetector>
      </View>

      <Divider />
    </Animated.View>
  );
};

const Divider = () => {
  return (
    <View
      style={{
        marginLeft: Spacing.defaultMargin + 40 + Spacing.l,
        height: 1,
        backgroundColor: Colors.BorderSubdued,
      }}
    />
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
  "react-native-learning",
  "balance-mobile",
  "android",
  //   "shop-core-mobile",
  //   "shopify",
  //   "ios-retail",
  //   "simon-says-rn",
  //   "docusaurus",
  //   "hydrogren",
  //   "oxygen",
];
