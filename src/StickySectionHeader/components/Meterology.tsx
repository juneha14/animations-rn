import React, { useState } from "react";
import { Dimensions, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { Spacing, Palette } from "../../utils";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Section } from "../Section";

export const OtherMeteorlogyInfo = ({
  scrollY,
}: {
  scrollY: Animated.SharedValue<number>;
}) => {
  const [containerPosition, setContainerPosition] = useState(0);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: Spacing.m,
      }}
      onLayout={(e) => {
        setContainerPosition(e.nativeEvent.layout.y);
      }}
    >
      {DATA.map((data, index) => {
        return (
          <Meteorology
            key={data.header}
            header={data.header}
            headerIcon={data.headerIcon}
            content={data.content}
            description={data.description}
            scrollY={scrollY}
            origin={
              containerPosition +
              Math.floor(index / 2) * (METEROLOGY_SIZE + Spacing.m)
            }
          />
        );
      })}
    </View>
  );
};

interface MeterologyProps {
  header: string;
  headerIcon: IconType;
  content: string;
  description: string;
}

const Meteorology = ({
  header,
  headerIcon,
  content,
  description,
  scrollY,
  origin,
}: MeterologyProps & {
  scrollY: Animated.SharedValue<number>;
  origin: number;
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
      scrollY={scrollY}
      initialPosition={origin}
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

const DATA: MeterologyProps[] = [
  {
    header: "UV Index",
    headerIcon: { type: "ionicon", name: "ios-sunny" },
    content: "0 Low",
    description: "Low levels all day.",
  },
  {
    header: "Sunset",
    headerIcon: { type: "feather", name: "sunset" },
    content: "18:09",
    description: "Sunrise: 06:36",
  },
  {
    header: "Wind",
    headerIcon: { type: "feather", name: "wind" },
    content: "6 km/h SW",
    description: "Expect some wind in the afternoon.",
  },
  {
    header: "Rainfall",
    headerIcon: { type: "ionicon", name: "ios-rainy" },
    content: "0mm",
    description: "Next expected is 4mm Fri.",
  },
  {
    header: "Feels like",
    headerIcon: { type: "ionicon", name: "ios-thermometer-outline" },
    content: "3°",
    description: "Wind is making it feel colder.",
  },
  {
    header: "Humidity",
    headerIcon: { type: "feather", name: "droplet" },
    content: "38%",
    description: "The dew point is -9° right now.",
  },
  {
    header: "Visibility",
    headerIcon: { type: "ionicon", name: "ios-eye-outline" },
    content: "16 km",
    description: "It's perfectly clear right now.",
  },
  {
    header: "Pressure",
    headerIcon: { type: "feather", name: "activity" },
    content: "1,026 hPa",
    description: "",
  },
];
