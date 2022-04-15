import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing } from "../../utils";

const Section = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <View style={{ paddingVertical: Spacing.xl }}>{children}</View>
      <View style={{ height: 1, backgroundColor: Colors.Border }} />
    </>
  );
};

export const LocationAndReview = ({ id }: { id: string }) => {
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

export const Specifications = () => {
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

export const FeaturedAmenities = () => {
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

export const Description = () => {
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

export const Offerings = () => {
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

const Docusaurus = {
  profile: require("../../../assets/docusaurus.png"),
};
