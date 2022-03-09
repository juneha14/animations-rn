import React from "react";
import { ScrollView, Text, View, ViewStyle, StyleProp } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Palette, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

export const AppleWeather: React.FC = () => {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: Palette.Blue.L1 }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.xl,
        paddingVertical: top + Spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <HourlyForecast />
      <TenDayForecast />
    </ScrollView>
  );
};

const Header = () => {
  return (
    <View
      style={[
        { justifyContent: "center", alignItems: "center", marginTop: 30 },
      ]}
    >
      <Text style={{ color: Palette.White, fontSize: 35 }}>
        Greater Vancouver
      </Text>
      <Text
        style={{
          color: Palette.White,
          fontSize: 90,
          fontWeight: "200",
          marginVertical: -10,
          marginLeft: 10,
        }}
      >
        4°
      </Text>
      <Text style={{ color: Palette.White, fontSize: 20, fontWeight: "500" }}>
        Mostly Sunny
      </Text>
      <Text style={{ color: Palette.White, fontSize: 20, fontWeight: "500" }}>
        H: 7° L: 2°
      </Text>
      <View />
    </View>
  );
};

interface SectionProps {
  headerTitle: string;
  headerLeftIcon?: JSX.Element;
  style?: StyleProp<ViewStyle>;
}

const Section: React.FC<SectionProps> = ({
  headerTitle,
  headerLeftIcon,
  style,
  children,
}) => {
  return (
    <View
      style={[
        {
          borderRadius: 10,
          backgroundColor: Palette.Blue.Primary,
        },
        style,
      ]}
    >
      <View style={{ paddingVertical: 4 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: Spacing.m,
            marginHorizontal: 12,
          }}
        >
          {headerLeftIcon ? headerLeftIcon : null}
          <Text
            style={{
              color: Colors.SurfaceForegroundPressed,
              fontWeight: "500",
              marginLeft: headerLeftIcon ? 5 : 0,
            }}
          >
            {headerTitle.toUpperCase()}
          </Text>
        </View>

        <View
          style={{
            height: 0.5,
            marginLeft: 12,
            backgroundColor: Colors.BorderSubdued,
          }}
        />
      </View>
      {children}
    </View>
  );
};

const HourlyForecast = () => {
  return (
    <Section headerTitle="Hourly Forecast" style={{ marginTop: 40 }}>
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

const TenDayForecast = () => {
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
      style={{ marginTop: Spacing.m }}
    >
      {[...Array(9).keys()].map((val) => {
        const { day, weather, temperature } = TEN_DAY_DATA[val];

        let icon;
        if (weather === "sunny") {
          icon = (
            <Ionicons name="ios-sunny" size={24} color={Palette.Yellow.L1} />
          );
        } else if (weather === "cloudy") {
          icon = <Ionicons name="ios-cloudy" size={24} color={Palette.White} />;
        } else {
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
        }

        return (
          <View
            key={val}
            style={{
              justifyContent: "center",
              paddingHorizontal: Spacing.l,
              marginBottom: 2,
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
