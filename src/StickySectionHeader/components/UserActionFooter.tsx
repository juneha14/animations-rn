/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { Text, View } from "react-native";
import { Colors, Palette, Spacing } from "../../utils";
import { Ionicons } from "@expo/vector-icons";

export const UserActions = () => {
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

export const Footer = () => {
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
