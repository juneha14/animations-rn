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

export const InstagramPostDetailsScreen: React.FC = () => {
  const { pop } = useRouteNavigation();
  const {
    params: { post },
  } = useRouteParams("Shared Transition - Instagram Details");

  return (
    <View
      style={{
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 1 }}
      >
        <Image
          source={{ uri: post.download_url }}
          style={{ width: IMG_WIDTH, height: IMG_HEIGHT }}
          resizeMode="cover"
        />
        <Pressable
          style={{ position: "absolute", top: 50, left: 10 }}
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
          // flex: 1,
          paddingTop: IMG_HEIGHT,
          zIndex: 1,
          // backgroundColor: Colors.SurfaceBackground,
        }}
        contentContainerStyle={{
          // flexGrow: 1,
          backgroundColor: Colors.SurfaceBackground,
        }}
      ></ScrollView>
    </View>
  );
};

const { width: WIDTH } = Dimensions.get("window");
const IMG_WIDTH = WIDTH;
const IMG_HEIGHT = (IMG_WIDTH * 9) / 16;
