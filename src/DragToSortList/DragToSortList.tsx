import React from "react";
import { Image, Text, View } from "react-native";
import Animated from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

export const DragToSortList: React.FC = () => {
  return (
    <Animated.ScrollView
      style={{ backgroundColor: Colors.SurfaceForeground }}
      contentContainerStyle={{ backgroundColor: Colors.SurfaceForeground }}
    >
      {DATA.map((val, index) => (
        <Row key={val} index={index} title={val} />
      ))}
    </Animated.ScrollView>
  );
};

const Row = ({ index, title }: { index: number; title: string }) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          height: 60,
          paddingHorizontal: Spacing.defaultMargin,
        }}
      >
        <Image
          source={Images.profile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderColor: Colors.BorderSubdued,
            borderWidth: 1,
          }}
        />
        <View style={{ flex: 1, marginLeft: Spacing.l }}>
          <Text style={{ color: Colors.TextNeutral, fontSize: 14 }}>
            Docusaurus
          </Text>
          <Text style={{ fontWeight: "600", fontSize: 16 }}>{title}</Text>
        </View>

        <View>
          <Ionicons
            name="ios-menu-outline"
            size={25}
            color={Colors.IconNeutral}
          />
        </View>
      </View>
      <Divider />
    </View>
  );
};

const Divider = () => {
  return (
    <View
      style={{
        marginLeft: Spacing.defaultMargin + 40 + Spacing.l,
        height: 1,
        backgroundColor: Colors.BorderSubdued,
      }}
    />
  );
};

const Images = {
  profile: require("../../assets/docusaurus.png"),
  posts: [
    "https://cdn.pixabay.com/photo/2013/10/29/02/13/jardin-202150_960_720.jpg",
    "https://cdn.pixabay.com/photo/2020/06/20/02/56/dusk-5319496_960_720.jpg",
    "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
  ],
};

const DATA = [
  "arrive-client",
  "ios",
  "pos-next-react-native",
  "media-db-rn",
  "animations-rn",
  "memory-matching-game-rn",
  "react-native-learning",
  "balance-mobile",
  "android",
  "shop-core-mobile",
];
