import React from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  snapPoints,
  Spacing,
  useRouteNavigation,
  useRouteParams,
} from "../../utils";
import {
  LocationAndReview,
  Specifications,
  FeaturedAmenities,
  Description,
  Offerings,
} from "./ListingDetailComponents";

export const AirbnbListingDetailsScreen = () => {
  const { pop } = useRouteNavigation();
  const {
    params: { listing },
  } = useRouteParams("Airbnb Details");

  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const distance = useDerivedValue(() => {
    return Math.sqrt(offsetX.value ** 2 + offsetY.value ** 2);
  });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      offsetX.value = e.translationX;
      offsetY.value = e.translationY;
    })
    .onEnd((e) => {
      const snapX = snapPoints(offsetX.value, e.velocityX, [0, WIDTH / 2]);
      const snapY = snapPoints(offsetY.value, e.velocityY, [0, HEIGHT / 2]);

      if (snapX === WIDTH / 2 || snapY === HEIGHT / 2) {
        runOnJS(pop)();
      } else {
        offsetX.value = withTiming(0);
        offsetY.value = withTiming(0);
      }
    });

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        {
          scale: interpolate(
            distance.value,
            [0, Math.sqrt(WIDTH ** 2 + HEIGHT ** 2)],
            [1, 0.6],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            overflow: "hidden",
            borderRadius: 20,
          },
          aStyle,
        ]}
      >
        {/* Header */}
        <NavigationButtons
          sharedElementId={`${listing.id}.icon`}
          scrollY={scrollY}
        />
        <HeaderImage
          sharedElementId={`${listing.id}.photo`}
          uri={listing.download_url}
          scrollY={scrollY}
        />

        {/* Content */}
        <Animated.ScrollView
          style={{
            marginTop: 80,
            paddingTop: IMG_HEIGHT - 80,
          }}
          contentContainerStyle={{
            marginTop: -30,
            paddingTop: 6,
            paddingBottom: IMG_HEIGHT - 80,
            paddingHorizontal: Spacing.xl,
          }}
          scrollEventThrottle={16}
          onScroll={onScroll}
        >
          <View style={{ zIndex: 1 }}>
            <LocationAndReview id={`${listing.id}.content`} />

            <Animated.View
              entering={FadeIn.delay(300).duration(300)}
              exiting={FadeOut.duration(300)}
            >
              <Specifications />
              <FeaturedAmenities />
              <Description />
              <Offerings />
            </Animated.View>
          </View>

          {/* Dummy content container background */}
          <SharedElement
            id={`${listing.id}.background`}
            style={{ ...StyleSheet.absoluteFillObject, zIndex: 0 }}
          >
            <View
              style={{
                flex: 1,
                borderTopRightRadius: 30,
                borderTopLeftRadius: 30,
                backgroundColor: Colors.SurfaceBackground,
              }}
            />
          </SharedElement>
        </Animated.ScrollView>
      </Animated.View>
    </GestureDetector>
  );
};

const HeaderImage = ({
  uri,
  sharedElementId,
  scrollY,
}: {
  uri: string;
  sharedElementId: string;
  scrollY: Animated.SharedValue<number>;
}) => {
  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, IMG_HEIGHT - 80],
            [0, -100],
            Extrapolate.CLAMP
          ),
        },
        {
          scale: interpolate(scrollY.value, [-30, 0], [1.5, 1], {
            extrapolateLeft: "extend",
            extrapolateRight: "clamp",
          }),
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
        },
        aStyle,
      ]}
    >
      <SharedElement id={sharedElementId}>
        <Image
          source={{ uri }}
          resizeMode="cover"
          style={{ width: IMG_WIDTH, height: IMG_HEIGHT, borderRadius: 10 }}
        />
      </SharedElement>
    </Animated.View>
  );
};

const NavigationButtons = ({
  sharedElementId,
  scrollY,
}: {
  sharedElementId: string;
  scrollY: Animated.SharedValue<number>;
}) => {
  const { pop } = useRouteNavigation();
  const { top } = useSafeAreaInsets();

  const navHeaderOverlayAStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [0, IMG_HEIGHT - (top + 100), IMG_HEIGHT - (top + 60)],
        [0, 0.2, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: top + 50,
            backgroundColor: Colors.SurfaceBackground,
            zIndex: 1,
          },
          navHeaderOverlayAStyle,
        ]}
      />

      <SharedElement
        id={sharedElementId}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: top + 50,
          zIndex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingBottom: Spacing.m,
            paddingHorizontal: Spacing.defaultMargin,
          }}
        >
          <IconButton icon="close" onPress={() => pop()} />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton icon="share" iconMargin={2} />
            <IconButton icon="like" marginLeft={Spacing.s} />
          </View>
        </View>
      </SharedElement>
    </>
  );
};

const IconButton = ({
  icon,
  onPress,
  marginLeft,
  iconMargin,
}: {
  icon: "close" | "share" | "like";
  onPress?: () => void;
  marginLeft?: number;
  iconMargin?: number;
}) => {
  let iconName;
  switch (icon) {
    case "close":
      iconName = "ios-close-outline";
      break;
    case "share":
      iconName = "ios-share-outline";
      break;
    case "like":
      iconName = "ios-heart-outline";
      break;
  }

  return (
    <Pressable
      style={{
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        marginLeft,
        backgroundColor: Colors.SurfaceBackground,
      }}
      onPress={onPress}
    >
      <Ionicons
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name={iconName as any}
        size={20}
        color={Colors.IconNeutral}
        style={{ marginLeft: iconMargin }}
      />
    </Pressable>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// AirbnbListingDetailsScreen.sharedElements = (route: any) => {
//   const { listing } = route.params;
//   return [
//     { id: `${listing.id}.photo` },
//     { id: `${listing.id}.background`, animation: "fade", resize: "none" },
//     { id: `${listing.id}.content`, animation: "fade", resize: "none" }, // Order matters! If I put this above the `background` row, then this `content` does not animate
//   ];
// };

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");
const IMG_WIDTH = WIDTH;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16 + 120;
