import React from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Colors, Spacing } from "../../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Card, CardBrand, CARDS } from "./PayCard";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

export const ShopPayWalletScreen = () => {
  const { top } = useSafeAreaInsets();

  return <CardDetailSheet />;

  return (
    <ScrollView
      style={{
        paddingTop: top,
        backgroundColor: Colors.SurfaceBackground,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: Spacing.l,
      }}
    >
      {CARDS.map((card) => {
        return <Card key={card} brand={card as CardBrand} />;
      })}
    </ScrollView>
  );
};

const CardDetailSheet = () => {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const containerAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: 0,
        },
      ],
    };
  });

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        paddingBottom: bottom,
        paddingHorizontal: Spacing.l,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      <Pressable
        style={{ marginLeft: -Spacing.m }}
        onPress={() =>
          console.log(
            "[Debugging] ==== File: ShopPayWalletScreen.tsx, Line: 63 ===="
          )
        }
      >
        <Ionicons
          name="ios-chevron-back"
          size={30}
          color={Colors.IconNeutral}
        />
      </Pressable>

      <ScrollView contentContainerStyle={{ flexGrow: 1, marginTop: Spacing.l }}>
        <Animated.View style={[{ flex: 1 }, containerAStyle]}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Card brand="visa" />
          </View>

          {/* Card details */}
          <View style={{ marginTop: Spacing.l }}>
            <Text
              style={{
                fontWeight: "700",
                fontSize: 25,
                marginBottom: Spacing.m,
              }}
            >
              Card details
            </Text>
            <CardInfo label="Expiry date" value="11/24" showDivider />
            <CardInfo
              label="Billing address"
              value={"5775 Toronto Rd\nVancouver, BC\nV6T1X4\nCanada"}
            />
          </View>

          {/* Footer buttons */}
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Pressable
              style={{
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: Spacing.m,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: Colors.ActionCritical,
              }}
            >
              <Text
                style={{
                  color: Colors.TextCritical,
                  fontWeight: "500",
                  fontSize: 16,
                }}
              >
                Remove card
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const CardInfo = ({
  label,
  value,
  showDivider,
}: {
  label: string;
  value: string;
  showDivider?: boolean;
}) => {
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: Spacing.l,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: 12,
            }}
          >
            {label}
          </Text>
        </View>
        <View style={{ flex: 2, marginLeft: Spacing.m }}>
          <Text>{value}</Text>
        </View>
      </View>
      {showDivider ? (
        <View style={{ height: 1, backgroundColor: Colors.BorderSubdued }} />
      ) : null}
    </>
  );
};
