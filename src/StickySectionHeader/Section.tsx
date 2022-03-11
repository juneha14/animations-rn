import React from "react";
import { StyleProp, ViewStyle, Text, View } from "react-native";
import { Palette, Spacing, Colors } from "../utils";

interface SectionProps {
  headerTitle: string;
  headerLeftIcon?: JSX.Element;
  showHeaderDivider?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Section: React.FC<SectionProps> = ({
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
