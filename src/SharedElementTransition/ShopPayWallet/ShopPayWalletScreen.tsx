import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Colors, Spacing } from "../../utils";
import { Ionicons } from "@expo/vector-icons";

export const ShopPayWalletScreen = () => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: Spacing.l,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      {CARDS.map((card) => {
        return <Card key={card} brand={card as CardBrand} />;
      })}
    </ScrollView>
  );
};

const Card = ({ brand }: { brand: CardBrand }) => {
  return (
    <View
      style={{
        width: 310,
        height: 180,
        padding: Spacing.l,
        marginBottom: Spacing.l,
        borderRadius: 10,
        backgroundColor: ColorForCardBrand[brand],
      }}
    >
      {/* Chip and brand icon */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Ionicons
          name="hardware-chip-outline"
          size={40}
          color={Colors.IconOnPrimary}
        />
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          {NameForCardBrand[brand]}
        </Text>
      </View>

      {/* Card details */}
      <View style={{ flex: 1, justifyContent: "space-evenly" }}>
        {/* Obfuscated number */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              color: Colors.TextOnSurfacePrimary,
              fontWeight: "700",
              fontSize: 30,
            }}
          >
            •••• •••• ••••
          </Text>
          <Text
            style={{
              color: Colors.TextOnSurfacePrimary,
              fontWeight: "500",
              fontSize: 16,
              marginLeft: 5,
            }}
            adjustsFontSizeToFit
          >
            4242
          </Text>
        </View>

        {/* Expiry and name */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <CardDetailContent label="Expires" value="11/2024" />
          <CardDetailContent label="Cardholder name" value="June Ha" />
        </View>
      </View>
    </View>
  );
};

const CardDetailContent = ({
  label,
  value,
}: {
  label: string;
  value: string;
}) => {
  return (
    <View>
      <Text
        style={{
          color: Colors.TextOnSurfacePrimary,
          opacity: 0.8,
          textTransform: "uppercase",
          fontSize: 12,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          color: Colors.TextOnSurfacePrimary,
          fontWeight: "600",
          fontSize: 18,
        }}
      >
        {value}
      </Text>
    </View>
  );
};

const CARDS = ["visa", "mastercard", "amex"];
type CardBrand = typeof CARDS[number];

const ColorForCardBrand: Record<CardBrand, string> = {
  visa: "darksalmon",
  mastercard: "pink",
  amex: "burlywood",
};

const NameForCardBrand: Record<CardBrand, string> = {
  visa: "VISA",
  mastercard: "Mastercard",
  amex: "AMEX",
};
