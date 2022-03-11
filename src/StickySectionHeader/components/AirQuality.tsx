import React from "react";
import { Text, View, Image } from "react-native";
import { Colors, Palette, Spacing } from "../../utils";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { Section } from "../Section";

export const AirQuality = () => {
  return (
    <Section
      headerTitle="Air Quality"
      headerLeftIcon={<Entypo name="air" size={15} color={Palette.White} />}
      showHeaderDivider
      style={{ marginTop: Spacing.m }}
    >
      <View
        style={{
          paddingHorizontal: Spacing.l,
          marginTop: Spacing.m,
        }}
      >
        <Text
          style={{
            color: Palette.White,
            fontSize: 18,
            fontWeight: "600",
            marginBottom: Spacing.l,
          }}
        >
          1 - Low Health Risk
        </Text>
        <Text
          style={{
            color: Palette.White,
            fontSize: 16,
            marginBottom: Spacing.l,
          }}
        >
          Air quality index is 1, which is similar to yesterday at about this
          time.
        </Text>
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Spectrum.2400.1800.S.G.png",
          }}
          style={{ height: 4, borderRadius: 10, marginBottom: Spacing.l }}
        />
        <View style={{ marginBottom: Spacing.m }}>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.SurfaceBackgroundPressed,
              opacity: 0.5,
              marginBottom: Spacing.m,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: Palette.White, fontSize: 16 }}>See More</Text>
            <Ionicons
              name="ios-chevron-forward-outline"
              size={20}
              color={Palette.White}
            />
          </View>
        </View>
      </View>
    </Section>
  );
};
