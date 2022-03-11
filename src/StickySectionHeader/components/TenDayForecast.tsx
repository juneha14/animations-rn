import React from "react";
import { View, Text } from "react-native";
import { Colors, Spacing, Palette } from "../../utils";
import { Ionicons } from "@expo/vector-icons";
import { Section } from "../Section";

export const TenDayForecast = () => {
  return (
    <Section
      headerTitle="10-Day Forecast"
      headerLeftIcon={
        <Ionicons
          name="ios-calendar-outline"
          color={Colors.SurfaceForegroundPressed}
          size={15}
        />
      }
      showHeaderDivider
      style={{ marginTop: Spacing.m }}
    >
      {[...Array(9).keys()].map((val) => {
        const { day, weather, temperature } = TEN_DAY_DATA[val];

        let icon;
        switch (weather) {
          case "sunny":
            icon = (
              <Ionicons name="ios-sunny" size={24} color={Palette.Yellow.L1} />
            );
            break;
          case "cloudy":
            icon = (
              <Ionicons name="ios-cloudy" size={24} color={Palette.White} />
            );
            break;
          case "rainy":
            icon = (
              <View>
                <Ionicons name="ios-rainy" size={24} color={Palette.White} />
                <Text
                  style={{ color: Palette.Blue.D1, fontSize: 12, marginTop: 2 }}
                >
                  70%
                </Text>
              </View>
            );
            break;
        }

        return (
          <View
            key={val}
            style={{
              justifyContent: "center",
              paddingHorizontal: Spacing.l,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                height: 50,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: Palette.White,
                    fontWeight: "500",
                    fontSize: 18,
                  }}
                >
                  {day}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                }}
              >
                {icon}
              </View>
              <View
                style={{
                  flex: 2,
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: Palette.White,
                    fontSize: 18,
                    fontWeight: "500",
                  }}
                >{`${temperature.low}°`}</Text>
                <View
                  style={{
                    width: 100,
                    height: 4,
                    borderRadius: 10,
                    marginHorizontal: 5,
                    backgroundColor: Palette.Blue.D1,
                    opacity: 0.4,
                  }}
                />
                <Text
                  style={{
                    color: Palette.White,
                    fontSize: 18,
                    fontWeight: "500",
                  }}
                >{`${temperature.high}°`}</Text>
              </View>
            </View>

            {val < TEN_DAY_DATA.length - 1 ? (
              <View
                style={{
                  height: 0.5,
                  opacity: 0.5,
                  backgroundColor: Colors.BorderSubdued,
                }}
              />
            ) : null}
          </View>
        );
      })}
    </Section>
  );
};

type TenDayDataType = {
  day: string;
  weather: "sunny" | "cloudy" | "rainy";
  temperature: { low: number; high: number };
};
const TEN_DAY_DATA: TenDayDataType[] = [
  {
    day: "Today",
    weather: "sunny",
    temperature: { low: 2, high: 7 },
  },
  {
    day: "Thu",
    weather: "sunny",
    temperature: { low: 1, high: 7 },
  },
  {
    day: "Fri",
    weather: "rainy",
    temperature: { low: 3, high: 6 },
  },
  {
    day: "Sat",
    weather: "rainy",
    temperature: { low: 4, high: 7 },
  },
  {
    day: "Sun",
    weather: "sunny",
    temperature: { low: 6, high: 9 },
  },
  {
    day: "Mon",
    weather: "cloudy",
    temperature: { low: 2, high: 7 },
  },
  {
    day: "Tue",
    weather: "cloudy",
    temperature: { low: 7, high: 9 },
  },
  {
    day: "Wed",
    weather: "rainy",
    temperature: { low: 2, high: 7 },
  },
  {
    day: "Thu",
    weather: "sunny",
    temperature: { low: 0, high: 12 },
  },
];
