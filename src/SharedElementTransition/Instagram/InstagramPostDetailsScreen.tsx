import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SharedElement } from "react-navigation-shared-element";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  useRouteNavigation,
  useRouteParams,
} from "../../utils";

// navigation header bar background color animate when scrolling
// smoother render animation of other non-shared element id components

export const InstagramPostDetailsScreen = () => {
  const {
    params: { post },
  } = useRouteParams("Airbnb Details");

  const opacity = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    opacity.value = withDelay(0, withTiming(1, { duration: 300 }));
  }, [opacity]);

  return (
    <View style={{ backgroundColor: Colors.SurfaceBackground }}>
      <NavigationButtons />
      <Images id={`${post.id}.photo`} uri={post.download_url} />

      <Animated.ScrollView
        style={{
          marginTop: 80,
          paddingTop: IMG_HEIGHT - 80,
        }}
        contentContainerStyle={[
          {
            marginTop: -30,
            paddingTop: 6,
            paddingBottom: IMG_HEIGHT - 80,
            paddingHorizontal: Spacing.xl,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            backgroundColor: Colors.SurfaceBackground,
          },
          aStyle,
        ]}
      >
        <LocationAndReview />
        <Specifications />
        <FeaturedAmenities />
        <Description />
        <Offerings />
      </Animated.ScrollView>
    </View>
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

const LocationAndReview = () => {
  return (
    <Section>
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

const Images = ({ id, uri }: { uri: string; id: string }) => {
  return (
    <SharedElement
      id={id}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
      }}
    >
      <Image
        source={{
          uri: uri,
          cache: "default",
          width: IMG_WIDTH,
          height: IMG_HEIGHT,
        }}
        resizeMode="cover"
      />
    </SharedElement>
  );
};

const NavigationButtons = () => {
  const { pop } = useRouteNavigation();

  return (
    <View
      style={{
        position: "absolute",
        top: 50,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.defaultMargin,
        zIndex: 1,
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
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
InstagramPostDetailsScreen.sharedElements = (route: any) => {
  const { post } = route.params;
  return [`${post.id}.photo`];
};

const { width: WIDTH } = Dimensions.get("window");
const IMG_WIDTH = WIDTH;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16 + 120;
const Docusaurus = {
  profile: require("../../../assets/docusaurus.png"),
};
