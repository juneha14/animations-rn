import React from "react";
import { Image, Text, View } from "react-native";
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
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
  const inProgress = useSharedValue(false);

  const startDragY = useSharedValue(0);
  const dragY = useSharedValue(0);
  const dragging = useSharedValue(false);
  const zIndex = useSharedValue(0);

  const move = (y: number) => {
    "worklet";
    offsetY.value = withTiming(
      y,
      { duration: 50 },
      () => (inProgress.value = false)
    );
  };

  useAnimatedReaction(
    () => Math.abs(absY.value - NAV_BAR_HEIGHT),
    (y) => {
      const top = activeRange[0] + offsetY.value;
      const bottom = activeRange[1] + offsetY.value;

      if (
        dragIndex.value !== index &&
        dragIndex.value !== -1 &&
        y >= top &&
        y <= bottom
      ) {
        const mid = top + ROW_HEIGHT / 2;

        if (velY.value > 0) {
          // Moving down
          if (y + ROW_HEIGHT > mid) {
            if (inProgress.value) return;
            inProgress.value = true;

            if (offsetY.value === 0) {
              //   offsetY.value = withTiming(-ROW_HEIGHT);
              //   offsetY.value = -ROW_HEIGHT;
              move(-ROW_HEIGHT);
            } else if (offsetY.value === ROW_HEIGHT) {
              //   offsetY.value = withTiming(0);
              //   offsetY.value = 0;
              move(0);
            }
          }
        } else {
          // Moving up
          if (y <= mid) {
            if (inProgress.value) return;
            inProgress.value = true;

            if (offsetY.value === 0) {
              //   offsetY.value = withTiming(ROW_HEIGHT);
              //   offsetY.value = ROW_HEIGHT;
              move(ROW_HEIGHT);
            } else if (offsetY.value === -ROW_HEIGHT) {
              //   offsetY.value = withTiming(0);
              //   offsetY.value = 0;
              move(0);
            }
          }
        }
      }
    }
  );

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startDragY.value = dragY.value;
      dragging.value = true;
      zIndex.value = 1;
      runOnJS(onBeginDrag)();
    })
    .onUpdate((e) => {
      absY.value = e.absoluteY;
      velY.value = e.velocityY;

      dragY.value = startDragY.value + e.translationY;
    })
    .onEnd(() => {
      //   dragY.value = withTiming(0, { duration: 0 }, () => {
      //     zIndex.value = 0;
      //   });
      dragging.value = false;
    });

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: dragging.value ? dragY.value : offsetY.value,
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
  "shop-core-mobile",
  "shopify",
  "ios-retail",
  "simon-says-rn",
  "docusaurus",
  "hydrogren",
  "oxygen",
];
