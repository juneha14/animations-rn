import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette, Spacing } from "../utils";
import { Header } from "./components/Header";
import { HourlyForecast } from "./components/HourlyForecast";
import { TenDayForecast } from "./components/TenDayForecast";
import { OtherMeteorlogyInfo } from "./components/Meterology";
import { AirQuality } from "./components/AirQuality";
import { UserActions, Footer } from "./components/UserActionFooter";

export const AppleWeather: React.FC = () => {
  const { top, bottom } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
      // console.log("==== Value of scrollY.value:", scrollY.value);
    },
  });

  return (
    <View style={{ backgroundColor: Palette.Blue.L1 }}>
      <Header scrollY={scrollY} />
      <Animated.ScrollView
        style={{
          marginTop: top + 110,
          zIndex: 2,
        }}
        contentContainerStyle={{
          paddingHorizontal: Spacing.xl,
          paddingTop: 110,
          paddingBottom: bottom,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <HourlyForecast scrollY={scrollY} />
        <TenDayForecast scrollY={scrollY} />
        <AirQuality />
        <OtherMeteorlogyInfo />
        <UserActions />
        <Footer />
      </Animated.ScrollView>
    </View>
  );
};
