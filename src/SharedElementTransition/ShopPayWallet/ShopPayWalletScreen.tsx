import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing } from "../../utils";
import { CardDetailSheetRef, CardDetailSheet } from "./CardDetailSheet";
import { CardBrand, CARDS, PayCard } from "./PayCard";

export const ShopPayWalletScreen = () => {
  const { top } = useSafeAreaInsets();

  const sheetRef = useRef<CardDetailSheetRef>(null);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.SurfaceBackground }}>
      <ScrollView
        style={{ paddingTop: top }}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingVertical: Spacing.l,
        }}
      >
        {CARDS.map((card) => {
          const cardBrand = card as CardBrand;
          return (
            <PayCard
              key={card}
              brand={cardBrand}
              onPress={() => {
                sheetRef.current?.showSheet({ cardBrand });
              }}
            />
          );
        })}
      </ScrollView>
      <CardDetailSheet ref={sheetRef} />
    </View>
  );
};
