import React from "react";
import { StyleProp, Text, StyleSheet, View, ViewStyle } from "react-native";
import { Colors } from "../../utils";
import { Ionicons } from "@expo/vector-icons";

interface IconLabelProps {
  type: Icon;
  style?: StyleProp<ViewStyle>;
}

export const IconLabel: React.FC<IconLabelProps> = ({ type, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        style={{ marginRight: 2 }}
        name={IconForType[type].name as IconName}
        size={18}
        color={Colors.IconSubdued}
      />
      <Text
        style={{
          color: IconForType[type].interactive
            ? Colors.TextInteractive
            : Colors.TextSubdued,
        }}
      >
        {IconForType[type].title}
      </Text>
    </View>
  );
};

const IconForType = {
  location: {
    name: "ios-location-outline",
    title: "Menlo Park, CA",
    interactive: true,
  },
  link: {
    name: "ios-link-outline",
    title: "v2.docusaurus.io",
    interactive: true,
  },
  calendar: {
    name: "calendar-outline",
    title: "Joined August 2017",
    interactive: false,
  },
};

type Icon = keyof typeof IconForType;
type IconName = keyof typeof Ionicons.glyphMap;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
