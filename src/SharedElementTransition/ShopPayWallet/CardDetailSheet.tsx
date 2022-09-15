import React, {
  forwardRef,
  Ref,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Colors, Spacing } from "../../utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PayCard, CardBrand } from "./PayCard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface CardDetailSheetProps {
  ref: Ref<CardDetailSheetRef>;
}

export interface CardDetailSheetRef {
  showSheet: ({ cardBrand }: { cardBrand: CardBrand }) => void;
}

export const CardDetailSheet = forwardRef<
  CardDetailSheetRef,
  CardDetailSheetProps
>((_, ref) => {
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();

  const [brand, setBrand] = useState<CardBrand>();
  const translateY = useSharedValue(height);

  const containerAStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const handleSheet = useCallback(
    (show: boolean) => {
      translateY.value = withTiming(show ? 0 : height, { duration: 500 });
    },
    [translateY, height]
  );

  useImperativeHandle(ref, () => {
    return {
      showSheet: ({ cardBrand }) => {
        setBrand(cardBrand);
        handleSheet(true);
      },
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: "100%",
          height,
          paddingTop: top,
          paddingBottom: bottom,
          paddingHorizontal: Spacing.l,
          backgroundColor: Colors.SurfaceBackground,
          zIndex: 2,
        },
        containerAStyle,
      ]}
    >
      {/* Left back navigation button */}
      <Pressable
        style={{ marginLeft: -Spacing.m }}
        onPress={() => handleSheet(false)}
      >
        <Ionicons
          name="ios-chevron-back"
          size={30}
          color={Colors.IconNeutral}
        />
      </Pressable>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          marginTop: Spacing.l,
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            {brand ? <PayCard brand={brand} /> : null}
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
        </View>
      </ScrollView>
    </Animated.View>
  );
});

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
