import React from "react";
import { Text, View } from "react-native";
import { Palette } from "../../utils";

export const Header = () => {
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
