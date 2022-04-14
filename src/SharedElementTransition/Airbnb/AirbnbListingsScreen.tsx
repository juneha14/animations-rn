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
import { SafeAreaView } from "react-native-safe-area-context";
import { SharedElement } from "react-navigation-shared-element";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, useRouteNavigation } from "../../utils";

export const AirbnbListingsScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ListingType[]>([]);
  const { navigate } = useRouteNavigation();

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

  const renderItem = useCallback(
    ({ item }: { item: ListingType }) => {
      return (
        <Pressable
          style={{ paddingVertical: Spacing.l }}
          onPress={() => navigate("Airbnb Details", { listing: item })}
        >
          <View>
            <SharedElement id={`${item.id}.photo`}>
              <Image
                source={{ uri: item.download_url }}
                style={{
                  width: IMG_WIDTH,
                  height: IMG_HEIGHT,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </SharedElement>

            <SharedElement
              id={`${item.id}.icon`}
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
              id={`${item.id}.background`}
              style={{ ...StyleSheet.absoluteFillObject }}
            >
              <View
                style={{ flex: 1, backgroundColor: Colors.SurfaceBackground }}
              />
            </SharedElement>

            {/* Actual content container */}
            <SharedElement id={`${item.id}.content`}>
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
        </Pressable>
      );
    },
    [navigate]
  );

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
