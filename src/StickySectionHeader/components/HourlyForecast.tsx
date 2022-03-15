import React from "react";
import { ScrollView, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { Spacing, Palette, Colors } from "../../utils";
import { Ionicons } from "@expo/vector-icons";
import { Section } from "../Section";

export const HourlyForecast = ({
  scrollY,
}: {
  scrollY: Animated.SharedValue<number>;
}) => {
  return (
    <Section
      headerTitle="Hourly Forecast"
      headerLeftIcon={
        <Ionicons
          name="ios-time-outline"
          size={15}
          color={Colors.SurfaceForegroundPressed}
        />
      }
      showHeaderDivider
      style={{ marginTop: 40 }}
      scrollY={scrollY}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {[...Array(24).keys()].map((time) => {
          return (
            <View
              key={time}
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingHorizontal: Spacing.m,
                marginHorizontal: Spacing.m,
                marginVertical: Spacing.m,
              }}
            >
              <Text
                style={{
                  color: Palette.White,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {time < 10 ? `0${time}` : time}
              </Text>
              <Ionicons
                style={{ marginVertical: Spacing.m }}
                name="ios-sunny"
                size={24}
                color={Palette.Yellow.L1}
              />
              <Text
                style={{
                  color: Palette.White,
                  fontSize: 17,
                  fontWeight: "600",
                }}
              >
                {`${Math.floor(Math.random() * 15)}°`}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </Section>
  );
};
