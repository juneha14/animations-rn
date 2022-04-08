import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Colors,
  Spacing,
  useRouteNavigation,
  useRouteParams,
} from "../../utils";
import { SharedElement } from "react-navigation-shared-element";

export const InstagramPostDetailsScreen = () => {
  const { pop } = useRouteNavigation();
  const {
    params: { post },
  } = useRouteParams("Shared Transition - Instagram Details");

  return (
    <>
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <SharedElement id={post.id}>
          <Image
            source={{
              uri: post.download_url,
              cache: "default",
              width: IMG_WIDTH,
              height: IMG_HEIGHT,
            }}
            resizeMode="cover"
          />
        </SharedElement>
        <Pressable
          style={{
            position: "absolute",
            top: 50,
            left: 10,
          }}
          onPress={() => pop()}
        >
          <Ionicons
            name="ios-arrow-back-circle-outline"
            size={40}
            color={Colors.IconOnPrimary}
          />
        </Pressable>
      </View>
      <ScrollView
        style={{
          paddingTop: IMG_HEIGHT,
        }}
        contentContainerStyle={{
          backgroundColor: Colors.SurfaceBackground,
        }}
      ></ScrollView>
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
InstagramPostDetailsScreen.sharedElements = (route: any) => {
  const { post } = route.params;
  return [post.id];
};

const { width: WIDTH } = Dimensions.get("window");
const IMG_WIDTH = WIDTH;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;
