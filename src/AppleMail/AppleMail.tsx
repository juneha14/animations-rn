import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

export const AppleMail: React.FC = () => {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.SurfaceForeground }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.defaultMargin,
        backgroundColor: Colors.SurfaceForeground,
      }}
    >
      <Header />
      {[...Array(20).keys()].map((val) => {
        return <Row key={val} val={val} />;
      })}
    </ScrollView>
  );
};

const Row = ({ val }: { val: number }) => {
  return (
    <>
      <View style={{ height: 1, backgroundColor: Colors.BorderSubdued }} />
      <View
        style={{
          paddingVertical: Spacing.m,
        }}
      >
        {/* Contact and date container */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "500",
              fontSize: 17,
            }}
          >{`John Doe ${val}`}</Text>
          <Text style={{ color: Colors.TextSubdued }}>Friday</Text>
        </View>

        {/* Mail title and content preview */}
        <View>
          <Text
            style={{
              fontSize: 15,
              marginBottom: 5,
              color: Colors.TextNeutral,
            }}
          >
            Money Team Update: January 2022
          </Text>
          <Text
            style={{ color: Colors.TextSubdued, fontSize: 15 }}
            numberOfLines={2}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </View>
    </>
  );
};

const Header = () => {
  return (
    <View style={{ marginBottom: Spacing.m }}>
      <Text style={{ fontWeight: "700", fontSize: 30 }}>Inbox</Text>
      {/* Search bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 5,
          paddingVertical: 8,
          borderRadius: 10,
          marginTop: Spacing.m,
          marginLeft: -10,
          backgroundColor: Colors.SurfaceBackgroundPressed,
        }}
      >
        <Ionicons
          name="ios-search-outline"
          size={20}
          color={Colors.IconNeutral}
          style={{ marginRight: Spacing.s }}
        />
        <Text style={{ color: Colors.TextSubdued, fontSize: 16 }}>Search</Text>
      </View>
    </View>
  );
};
