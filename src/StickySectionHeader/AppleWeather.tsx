import React, { useState } from "react";
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
  const [headerSize, setHeaderSize] = useState(0);
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  return (
    <View style={{ backgroundColor: Palette.Blue.L1 }}>
      <Header
        scrollY={scrollY}
        onLayout={(e) => {
          setHeaderSize(e.nativeEvent.layout.height);
        }}
      />
      <Animated.ScrollView
        style={{
          zIndex: 2,
        }}
        contentContainerStyle={{
          marginTop: 110 + top,
          paddingTop: headerSize - 110 - top,
          paddingBottom: 110 + top + bottom,
          paddingHorizontal: Spacing.xl,
        }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        <HourlyForecast scrollY={scrollY} />
        <TenDayForecast scrollY={scrollY} />
        <AirQuality scrollY={scrollY} />
        <OtherMeteorlogyInfo scrollY={scrollY} />
        <UserActions />
        <Footer />
      </Animated.ScrollView>
    </View>
  );
};
