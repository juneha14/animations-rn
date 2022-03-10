/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  ScrollView,
  Text,
  View,
  ViewStyle,
  StyleProp,
  Dimensions,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Palette, Spacing } from "../utils";
import { Ionicons, Feather, Entypo } from "@expo/vector-icons";

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
      <AirQuality />
      <OtherMeteorlogyInfo />
      <UserActions />
      <Footer />
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
  showHeaderDivider?: boolean;
  style?: StyleProp<ViewStyle>;
}

const Section: React.FC<SectionProps> = ({
  headerTitle,
  headerLeftIcon,
  showHeaderDivider = false,
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

        {showHeaderDivider ? (
          <View
            style={{
              height: 0.5,
              marginLeft: 12,
              backgroundColor: Colors.BorderSubdued,
            }}
          />
        ) : null}
      </View>
      {children}
    </View>
  );
};

const HourlyForecast = () => {
  return (
    <Section
      headerTitle="Hourly Forecast"
      showHeaderDivider
      style={{ marginTop: 40 }}
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

const AirQuality = () => {
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

const OtherMeteorlogyInfo = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: Spacing.m,
      }}
    >
      <Meteorology
        header="UV Index"
        headerIcon={{ type: "ionicon", name: "ios-sunny" }}
        content="0 Low"
        description="Low levels all day."
      />
      <Meteorology
        header="Sunset"
        headerIcon={{ type: "feather", name: "sunset" }}
        content="18:09"
        description="Sunrise: 06:36"
      />
      <Meteorology
        header="Wind"
        headerIcon={{ type: "feather", name: "wind" }}
        content="6 km/h SW"
        description="Expect some wind in the afternoon."
      />
      <Meteorology
        header="Rainfall"
        headerIcon={{ type: "ionicon", name: "ios-rainy" }}
        content="0mm"
        description="Next expected is 4mm Fri."
      />
      <Meteorology
        header="Feels like"
        headerIcon={{ type: "ionicon", name: "ios-thermometer-outline" }}
        content="3°"
        description="Wind is making it feel colder."
      />
      <Meteorology
        header="Humidity"
        headerIcon={{ type: "feather", name: "droplet" }}
        content="38%"
        description="The dew point is -9° right now."
      />
      <Meteorology
        header="Visibility"
        headerIcon={{ type: "ionicon", name: "ios-eye-outline" }}
        content="16 km"
        description="It's perfectly clear right now."
      />
      <Meteorology
        header="Pressure"
        headerIcon={{ type: "feather", name: "activity" }}
        content="1,026 hPa"
        description=""
      />
    </View>
  );
};

const { width: WIDTH } = Dimensions.get("window");
const METEROLOGY_SIZE = (WIDTH - 2 * Spacing.xl - Spacing.m) / 2;

interface IoniconType {
  type: "ionicon";
  name: keyof typeof Ionicons.glyphMap;
}
interface FeatherType {
  type: "feather";
  name: keyof typeof Feather.glyphMap;
}
type IconType = IoniconType | FeatherType;

const Meteorology = ({
  header,
  headerIcon,
  content,
  description,
}: {
  header: string;
  headerIcon: IconType;
  content: string;
  description: string;
}) => {
  let icon;
  switch (headerIcon.type) {
    case "ionicon":
      icon = (
        <Ionicons name={headerIcon.name} size={15} color={Palette.White} />
      );
      break;
    case "feather":
      icon = <Feather name={headerIcon.name} size={15} color={Palette.White} />;
      break;
  }

  return (
    <Section
      headerTitle={header}
      headerLeftIcon={icon}
      style={{
        width: METEROLOGY_SIZE,
        height: METEROLOGY_SIZE,
        marginBottom: Spacing.m,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          paddingVertical: Spacing.m,
          paddingHorizontal: Spacing.l,
        }}
      >
        <Text style={{ color: Palette.White, fontSize: 30, fontWeight: "400" }}>
          {content}
        </Text>
        <Text style={{ color: Palette.White, fontSize: 15 }}>
          {description}
        </Text>
      </View>
    </Section>
  );
};

const UserActions = () => {
  return (
    <View style={{ marginTop: Spacing.m }}>
      <View
        style={{
          height: 1,
          backgroundColor: Colors.SurfaceBackgroundPressed,
          opacity: 0.5,
        }}
      />
      <ActionRow type="report" />
      <ActionRow type="notification" />
      <ActionRow type="maps" />
    </View>
  );
};

const ActionRow = ({ type }: { type: "report" | "notification" | "maps" }) => {
  let title;
  let icon;
  switch (type) {
    case "report": {
      title = "Report an Issue";
      icon = "ios-chatbox-outline";
      break;
    }
    case "notification": {
      title = "Turn On Notifications";
      icon = "ios-notifications-outline";
      break;
    }
    case "maps": {
      title = "Open in Maps";
      icon = "ios-open-outline";
      break;
    }
  }
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <Text style={{ color: Colors.SurfaceBackgroundPressed }}>{title}</Text>
        <Ionicons name={icon as any} size={20} color={Palette.White} />
      </View>

      <View
        style={{
          height: 1,
          backgroundColor: Colors.SurfaceBackgroundPressed,
          opacity: 0.5,
        }}
      />
    </View>
  );
};

const Footer = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: Spacing.xl,
      }}
    >
      <Text
        style={{
          color: Palette.White,
          fontSize: 18,
          fontWeight: "500",
          marginBottom: Spacing.s,
        }}
      >
        Weather for Toronto Rd
      </Text>
      <Text style={{ color: Palette.White, opacity: 0.5 }}>
        Learn more about weather data and map data
      </Text>
    </View>
  );
};
