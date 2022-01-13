import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CollapsableSection } from "./CollapsableSection";

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

export const Accordion: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      {DATA.map((section, index) => {
        return (
          <View key={section.group}>
            <CollapsableSection section={section} />
            {index < DATA.length - 1 && <View style={styles.divider} />}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#E7E8EA",
  },
  divider: {
    height: 1,
    backgroundColor: "grey",
    opacity: 0.5,
  },
});
