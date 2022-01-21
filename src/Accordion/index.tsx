import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Accordion } from "./Accordion";
import { Colors } from "../utils";

export type IconName = keyof typeof Ionicons.glyphMap;

export interface Section {
  group: string;
  channels: string[];
  icon: IconName;
  iconColor: string;
}

const DATA: Section[] = [
  {
    group: "React Native",
    channels: ["react-native", "react-native-foundations", "react-native-skia"],
    icon: "ios-logo-react",
    iconColor: "#2E72D2",
  },
  {
    group: "POS Payments",
    channels: [
      "payments-and-hardware",
      "retail-payments",
      "retail-payments-team",
      "stripe-terminal",
      "stripe-terminal-devs",
    ],
    icon: "logo-usd",
    iconColor: "#008060",
  },
  {
    group: "POS Dev",
    channels: [
      "mobile-tooling",
      "pos-release-train",
      "retail-atc",
      "retail-dev",
    ],
    icon: "ios-git-network-outline",
    iconColor: "#4D421F",
  },
];

const Screen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {DATA.map((section, index) => {
        return (
          <View key={section.group}>
            <Accordion section={section} />
            {index < DATA.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </ScrollView>
  );
};

export default Screen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.SurfaceBackground,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.Border,
  },
});
