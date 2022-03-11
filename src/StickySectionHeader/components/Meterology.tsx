import React from "react";
import { Dimensions, View, Text } from "react-native";
import { Spacing, Palette } from "../../utils";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Section } from "../Section";

export const OtherMeteorlogyInfo = () => {
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
