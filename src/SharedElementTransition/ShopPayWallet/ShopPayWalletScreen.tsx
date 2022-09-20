import React, {
  forwardRef,
  Ref,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Dimensions, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, Spacing } from "../../utils";
import { CardDetailSheetRef, CardDetailSheet } from "./CardDetailSheet";
import { CardBrand, CARDS, PayCard } from "./PayCard";

export const ShopPayWalletScreen = () => {
  const { top } = useSafeAreaInsets();

  console.log("top", top);

  const sheetRef = useRef<CardDetailSheetRef>(null);
  const cardOverlayRef = useRef<CardOverlayRef>(null);

  return (
    <View
      style={{
        flex: 1,
        paddingTop: top,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      <ScrollView
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
              style={{ marginBottom: Spacing.l }}
              key={card}
              brand={cardBrand}
              onPress={(startPosY) => {
                sheetRef.current?.showSheet({ cardBrand });
                cardOverlayRef.current?.animateCard({
                  cardBrand,
                  startPosY,
                });
              }}
            />
          );
        })}
      </ScrollView>
      <CardDetailSheet ref={sheetRef} />
      <CardOverlay ref={cardOverlayRef} />
    </View>
  );
};

interface CardOverlayProps {
  ref: Ref<CardOverlayRef>;
}

export interface CardOverlayRef {
  animateCard: ({
    cardBrand,
    startPosY,
  }: {
    cardBrand: CardBrand;
    startPosY: number;
  }) => void;
}

const START_POS_X = (Dimensions.get("window").width - 310) / 2;

const CardOverlay = forwardRef<CardOverlayRef, CardOverlayProps>((_, ref) => {
  const TOP_INSET = useSafeAreaInsets().top;
  const TOP_Y = Spacing.l + 30 + TOP_INSET;
  const OFFSET_START_TOP_Y = TOP_INSET - 1;

  const [brand, setBrand] = useState<CardBrand>("visa");

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(0);

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
      opacity: opacity.value,
      zIndex: zIndex.value,
    };
  });

  useImperativeHandle(ref, () => {
    return {
      animateCard: ({ cardBrand, startPosY }) => {
        setBrand(cardBrand);

        opacity.value = 1;
        zIndex.value = 2;
        translateY.value = withSequence(
          withTiming(startPosY - OFFSET_START_TOP_Y, { duration: 0 }),
          withTiming(0, { duration: 500 })
        );
      },
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: TOP_Y,
          left: START_POS_X,
        },
        aStyle,
      ]}
    >
      <PayCard brand={brand} />
    </Animated.View>
  );
});
