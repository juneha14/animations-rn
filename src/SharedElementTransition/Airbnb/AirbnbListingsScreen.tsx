import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  View,
  Text,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import { useIsFocused } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, useRouteNavigation } from "../../utils";

export const AirbnbListingsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ListingType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://picsum.photos/v2/list");
        const data = (await res.json()) as ListingType[];

        if (res.ok) {
          setLoading(false);
          setData(data.slice(2, 10));
        }
      } catch (error) {
        console.error(`Failed to fetch data due to error: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const renderItem = useCallback(({ item }: { item: ListingType }) => {
    return <Listing listing={item} />;
  }, []);

  return (
    <>
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <SafeAreaView style={{ backgroundColor: Colors.SurfaceBackground }}>
          <FlatList
            style={{ backgroundColor: Colors.SurfaceBackground }}
            contentContainerStyle={{ paddingHorizontal: Spacing.defaultMargin }}
            keyExtractor={(item) => item.id}
            data={data}
            renderItem={renderItem}
            scrollIndicatorInsets={{ right: 1 }}
          />
        </SafeAreaView>
      )}
    </>
  );
};

const Listing = ({ listing }: { listing: ListingType }) => {
  const { navigate } = useRouteNavigation();
  const isFocused = useIsFocused();
  const [pressed, setPressed] = useState(false);

  const opacity = useDerivedValue(() => {
    if (isFocused && pressed) {
      return 1;
    } else if (pressed) {
      return withDelay(300, withTiming(0));
    }
  }, [isFocused, pressed]);

  const aStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value };
  });

  return (
    <AnimatedPressable
      style={[{ paddingVertical: Spacing.l }, aStyle]}
      onPress={() => {
        setPressed(true);
        navigate("Airbnb Details", { listing });
      }}
    >
      <View>
        <SharedElement id={`${listing.id}.photo`}>
          <Image
            source={{ uri: listing.download_url }}
            style={{
              width: IMG_WIDTH,
              height: IMG_HEIGHT,
              borderRadius: 10,
            }}
            resizeMode="cover"
          />
        </SharedElement>

        <SharedElement
          id={`${listing.id}.icon`}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
          }}
        >
          <View style={{ alignItems: "flex-end" }}>
            <Ionicons
              name="ios-heart-outline"
              size={25}
              color={Colors.IconOnPrimary}
              style={{ marginRight: Spacing.m, marginTop: Spacing.m }}
            />
          </View>
        </SharedElement>
      </View>

      <View>
        {/* Dummy content container background */}
        <SharedElement
          id={`${listing.id}.background`}
          style={{ ...StyleSheet.absoluteFillObject }}
        >
          <View
            style={{ flex: 1, backgroundColor: Colors.SurfaceBackground }}
          />
        </SharedElement>

        {/* Actual content container */}
        <SharedElement id={`${listing.id}.content`}>
          <View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginVertical: Spacing.m,
              }}
            >
              <Text style={{ marginRight: Spacing.s }}>⭐️ 4.75</Text>
              <Text style={{ color: Colors.TextSubdued }}>(180)</Text>
            </View>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "400",
                  marginBottom: Spacing.s,
                }}
              >
                Entire rental unit | Whistler
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "400" }}>
                AG314 Queen Boho Studio
              </Text>
            </View>
          </View>
        </SharedElement>
      </View>
    </AnimatedPressable>
  );
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const IMG_WIDTH = Dimensions.get("window").width - 2 * Spacing.defaultMargin;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;

export interface ListingType {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}
