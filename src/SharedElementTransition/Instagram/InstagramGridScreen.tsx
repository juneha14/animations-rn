import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import { Colors, useRouteNavigation } from "../../utils";

export const InstagramGridScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InstagramPostType[]>([]);
  const { push } = useRouteNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const res = await fetch("https://picsum.photos/v2/list");
        const data = (await res.json()) as InstagramPostType[];

        if (res.ok) {
          setLoading(false);
          setData(data.slice(0, 10));
        }
      } catch (error) {
        console.error(`Failed to fetch data due to error: ${error.message}`);
      }
    };

    fetchData();
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: InstagramPostType; index: number }) => {
      return (
        <SharedElement id={item.id}>
          <Pressable
            style={{
              marginVertical: 1,
              marginRight: 2,
              marginLeft: index % 3 === 0 ? 2 : 0,
            }}
            onPress={() => {
              push("Shared Transition - Instagram Details", { post: item });
            }}
          >
            <Image
              source={{ uri: item.download_url }}
              style={{ width: SIZE, height: SIZE }}
            />
          </Pressable>
        </SharedElement>
      );
    },
    [push]
  );

  return (
    <>
      {loading ? (
        <ActivityIndicator
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <FlatList
          style={{ backgroundColor: Colors.SurfaceBackground }}
          contentContainerStyle={
            {
              // justifyContent: "center",
              // alignItems: "center",
            }
          }
          keyExtractor={(item) => item.id}
          data={data}
          renderItem={renderItem}
          numColumns={3}
          scrollIndicatorInsets={{ right: 1 }}
        />
      )}
    </>
  );
};

const SIZE = Dimensions.get("window").width / 3 - 8 / 3;

export interface InstagramPostType {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}
