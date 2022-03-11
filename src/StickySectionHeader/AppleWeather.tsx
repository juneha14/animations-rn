import React from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette, Spacing } from "../utils";
import { Header } from "./components/Header";
import { HourlyForecast } from "./components/HourlyForecast";
import { TenDayForecast } from "./components/TenDayForecast";
import { OtherMeteorlogyInfo } from "./components/Meterology";
import { AirQuality } from "./components/AirQuality";
import { UserActions, Footer } from "./components/UserActionFooter";

export const AppleWeather: React.FC = () => {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      style={{ backgroundColor: Palette.Blue.L1 }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.xl,
        paddingVertical: top + Spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <HourlyForecast />
      <TenDayForecast />
      <AirQuality />
      <OtherMeteorlogyInfo />
      <UserActions />
      <Footer />
    </ScrollView>
  );
};
