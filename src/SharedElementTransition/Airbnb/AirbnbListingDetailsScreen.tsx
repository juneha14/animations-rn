import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolate,
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

// header image flicker

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
            <Specifications />
            <FeaturedAmenities />
            <Description />
            <Offerings />
          </View>

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

const Section = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <View style={{ paddingVertical: Spacing.xl }}>{children}</View>
      <View style={{ height: 1, backgroundColor: Colors.Border }} />
    </>
  );
};

const LocationAndReview = ({ id }: { id: string }) => {
  return (
    <Section>
      <SharedElement id={id}>
        <View>
          <Text
            style={{ fontSize: 24, fontWeight: "500", marginBottom: Spacing.l }}
          >
            AG314 Queen Boho Studio
          </Text>
          <View
            style={{
              flexWrap: "wrap",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ marginRight: Spacing.m }}>⭐️ 4.75</Text>
            <Text
              style={{
                marginRight: Spacing.m,
                textDecorationLine: "underline",
                fontWeight: "500",
              }}
            >
              180 reviews
            </Text>
            <Text style={{ marginRight: Spacing.m }}>🚀 Super Host</Text>
            <Text style={{ marginTop: Spacing.m }}>
              Whistler, British Columbia, Canada
            </Text>
          </View>
        </View>
      </SharedElement>
    </Section>
  );
};

const Specifications = () => {
  return (
    <Section>
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: Spacing.l,
          }}
        >
          <Text style={{ flexShrink: 1, fontSize: 22, fontWeight: "500" }}>
            Entire rental unit hosted by Christina
          </Text>
          <Image
            source={Docusaurus.profile}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              borderColor: Colors.Border,
            }}
          />
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ marginRight: Spacing.m }}>2 guests ·</Text>
          <Text style={{ marginRight: Spacing.m }}>Studio ·</Text>
          <Text style={{ marginRight: Spacing.m }}>1 bath</Text>
        </View>
      </View>
    </Section>
  );
};

const FeaturedAmenities = () => {
  return (
    <Section>
      <View>
        <View style={{ flexDirection: "row", marginBottom: Spacing.l }}>
          <Ionicons
            name="ios-location-outline"
            size={22}
            color={Colors.IconNeutral}
            style={{ marginRight: Spacing.m }}
          />
          <View style={{ flexShrink: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                marginBottom: Spacing.s,
              }}
            >
              Great location
            </Text>
            <Text style={{ color: Colors.TextSubdued }}>
              100% of recent guests gave the location a 5-star rating.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row", marginBottom: Spacing.l }}>
          <Ionicons
            name="ios-bookmark-outline"
            size={22}
            color={Colors.IconNeutral}
            style={{ marginRight: Spacing.m }}
          />
          <View style={{ flexShrink: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                marginBottom: Spacing.s,
              }}
            >
              Wifi
            </Text>
            <Text style={{ color: Colors.TextSubdued }}>
              Guests often search for this popular amenity.
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name="ios-star-outline"
            size={22}
            color={Colors.IconNeutral}
            style={{ marginRight: Spacing.m }}
          />
          <View style={{ flexShrink: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "400",
                marginBottom: Spacing.s,
              }}
            >
              Experienced host
            </Text>
            <Text style={{ color: Colors.TextSubdued }}>
              Christina has 51 reviews for other places.
            </Text>
          </View>
        </View>
      </View>
    </Section>
  );
};

const Description = () => {
  return (
    <>
      {/* Description */}
      <Section>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </Text>
      </Section>
    </>
  );
};

const Offerings = () => {
  return (
    <Section>
      <View>
        <Text style={{ fontSize: 22, fontWeight: "500" }}>
          What this place offers
        </Text>
        <View style={{ marginTop: Spacing.l }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: Spacing.m,
            }}
          >
            <Ionicons
              name="ios-flower-outline"
              size={20}
              color={Colors.IconNeutral}
              style={{ marginRight: Spacing.m }}
            />
            <Text>Garden view</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: Spacing.m,
            }}
          >
            <Ionicons
              name="ios-sunny-outline"
              size={20}
              color={Colors.IconNeutral}
              style={{ marginRight: Spacing.m }}
            />
            <Text>Beach view</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: Spacing.m,
            }}
          >
            <Ionicons
              name="ios-wifi-outline"
              size={20}
              color={Colors.IconNeutral}
              style={{ marginRight: Spacing.m }}
            />
            <Text>Wifi</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: Spacing.m,
            }}
          >
            <Ionicons
              name="ios-car-outline"
              size={20}
              color={Colors.IconNeutral}
              style={{ marginRight: Spacing.m }}
            />
            <Text>Free parking on premises</Text>
          </View>
        </View>

        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: Spacing.m,
            marginTop: Spacing.l,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.IconNeutral,
          }}
        >
          <Text>Show all 22 amenities</Text>
        </Pressable>
      </View>
    </Section>
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
          <Pressable
            style={{
              width: 30,
              height: 30,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.SurfaceBackground,
            }}
            onPress={() => pop()}
          >
            <Ionicons
              name="ios-close-outline"
              size={25}
              color={Colors.IconNeutral}
            />
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                marginRight: Spacing.m,
                backgroundColor: Colors.SurfaceBackground,
              }}
            >
              <Ionicons
                name="ios-share-outline"
                size={20}
                color={Colors.IconNeutral}
                style={{ marginLeft: 2 }}
              />
            </View>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Colors.SurfaceBackground,
              }}
            >
              <Ionicons
                name="ios-heart-outline"
                size={20}
                color={Colors.IconNeutral}
              />
            </View>
          </View>
        </View>
      </SharedElement>
    </>
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
const Docusaurus = {
  profile: require("../../../assets/docusaurus.png"),
};
