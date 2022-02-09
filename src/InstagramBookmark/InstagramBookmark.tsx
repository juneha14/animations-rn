import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Bookmark background color and scale animation
// Bookmark image going down to user tab animation

export const InstagramBookmark: React.FC = () => {
  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ backgroundColor: Colors.SurfaceBackground }}
      >
        {[...Array(3).keys()].map((val) => {
          return <Post key={val} index={val} />;
        })}
      </ScrollView>
      <TabBar />
      <BookmarkPreview img={{ uri: Images.posts[0] }} />
    </>
  );
};

type BookmarkPreviewProps = {
  img: { uri: string };
};

const BookmarkPreview: React.FC<BookmarkPreviewProps> = ({ img }) => {
  const { bottom, right } = useSafeAreaInsets();

  const imgUris = useRef<string[]>([]);
  const [currentImgUri, setCurrentImgUri] = useState<string>();

  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);
  const isShown = useSharedValue(false);

  useAnimatedReaction(
    () => isShown.value,
    (imgShown) => {
      if (imgShown) {
        scale.value = withDelay(300, withTiming(0.5));
        translateY.value = withDelay(
          300,
          withTiming(120, undefined, () => {
            isShown.value = false;
            scale.value = 1;
            translateY.value = 0;
          })
        );
      }
    }
  );

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  useEffect(() => {
    const runAnimation = (completion: () => void) => {
      "worklet";

      scale.value = withDelay(
        500,
        withTiming(1, undefined, () => {
          //   isShown.value = true;
          scale.value = withDelay(300, withTiming(0.5));
          translateY.value = withDelay(
            300,
            withTiming(120, undefined, () => {
              // Animation finished. Reset all values so that next animation can occur properly
              isShown.value = false;
              scale.value = 1;
              translateY.value = 0;
              runOnJS(completion)();
            })
          );
        })
      );
    };

    const recurse = () => {
      console.log(
        "========== File: InstagramBookmark.tsx, Line: 112 =========="
      );
      if (imgUris.current.length > 0) {
        console.log(
          "========== File: InstagramBookmark.tsx, Line: 114 =========="
        );
        const uri = imgUris.current.pop();
        setCurrentImgUri(uri);

        runAnimation(() => {
          console.log(
            "========== File: InstagramBookmark.tsx, Line: 123 =========="
          );
          recurse();
        });
      }
    };

    imgUris.current.push(img.uri);
    recurse();
    // scale.value = withDelay(
    //   500,
    //   withTiming(1, undefined, () => {
    //     isShown.value = true;
    //   })
    // );
  }, [img, scale, translateY, isShown]);

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          bottom: bottom + 24 + 12 + 10,
          right: right + 15,
        },
        aStyle,
      ]}
    >
      {currentImgUri && (
        <Image
          source={{ uri: currentImgUri }}
          style={{ width: 50, height: 50 }}
        />
      )}
    </Animated.View>
  );
};

const TabBar = () => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingTop: 12,
        paddingBottom: bottom,
        backgroundColor: Colors.SurfaceBackgroundPressed,
        // zIndex: 2,
      }}
    >
      <Ionicons name="ios-home-outline" size={24} color="black" />
      <Ionicons name="search-outline" size={24} color="black" />
      <MaterialCommunityIcons name="movie-roll" size={24} color="black" />
      <MaterialCommunityIcons name="shopping-outline" size={24} color="black" />
      <Ionicons name="person-circle-outline" size={24} color="black" />
    </View>
  );
};

const Post = ({ index }: { index: number }) => {
  const bookmarked = useSharedValue(false);

  return (
    <View style={{ paddingVertical: Spacing.m, marginBottom: 5 }}>
      <ProfileOverview index={index} />
      <PostImage bookmarked={bookmarked} index={index} />
      <PostContent
        onBookmarkPress={() => {
          bookmarked.value = !bookmarked.value;
        }}
      />
    </View>
  );
};

const PostImage = ({
  bookmarked,
  index,
}: {
  bookmarked: Animated.SharedValue<boolean>;
  index: number;
}) => {
  const translateY = useSharedValue(41);
  useAnimatedReaction(
    () => bookmarked.value,
    (b) => {
      if (b) {
        translateY.value = withSequence(
          withTiming(0),
          withDelay(800, withTiming(41))
        );
      }
    }
  );

  const savedToastAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  return (
    <ImageBackground
      source={{ uri: Images.posts[index] }}
      style={{
        width: POST_WIDTH,
        height: (POST_WIDTH * 9) / 16,
        justifyContent: "flex-end",
      }}
      imageStyle={{ resizeMode: "cover" }}
    >
      <Animated.View
        style={[
          {
            paddingHorizontal: Spacing.m,
            paddingVertical: 12,
            backgroundColor: Colors.SurfaceForegroundPressed,
          },
          savedToastAnimatedStyle,
        ]}
      >
        <Text style={{ color: Colors.ActionPrimary, fontWeight: "600" }}>
          Saved to Collection
        </Text>
      </Animated.View>
    </ImageBackground>
  );
};

const PostContent = ({ onBookmarkPress }: { onBookmarkPress: () => void }) => {
  const [bookmarked, setBookmarked] = useState(false);
  return (
    <View
      style={{
        paddingHorizontal: Spacing.m,
        paddingTop: Spacing.m,
        backgroundColor: Colors.SurfaceBackground,
      }}
    >
      {/* Action buttons container */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Ionicons name="ios-heart-outline" size={28} color="black" />
          <AntDesign
            name="message1"
            size={22}
            color="black"
            style={{ transform: [{ rotateY: "180deg" }] }}
          />
          <Ionicons name="ios-paper-plane-outline" size={24} color="black" />
        </View>

        {/* Bookmark button */}
        <Pressable
          style={{ flex: 3, alignItems: "flex-end", marginRight: 8 }}
          onPress={() => {
            onBookmarkPress();
            setBookmarked((b) => !b);
          }}
        >
          <Ionicons
            name={bookmarked ? "ios-bookmark" : "ios-bookmark-outline"}
            size={25}
            color="black"
          />
        </Pressable>
      </View>

      {/* Likes and description container */}
      <View style={{ marginTop: Spacing.m, paddingHorizontal: 5 }}>
        <Text style={{ fontWeight: "500" }}>305 likes</Text>
        <Text>
          <Text style={{ fontWeight: "500" }}>{`Docusaurus.dev `}</Text>
          <Text>
            {`Hey! Check out our new post! This was taken at Docusaurus' head office :)`}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const ProfileOverview = ({ index }: { index: number }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: Spacing.m,
        marginBottom: Spacing.s,
      }}
    >
      {/* Profile image, username, and location container */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={Images.profile}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: Colors.Border,
            marginRight: Spacing.m,
          }}
        />
        <View>
          <Text
            style={{
              color: Colors.TextNeutral,
              fontWeight: "600",
              fontSize: 14,
            }}
          >
            {`Docusaurus.dev + ${index}`}
          </Text>
          <Text style={{ color: Colors.TextSubdued, fontSize: 13 }}>
            Menlo Park, CA
          </Text>
        </View>
      </View>

      {/* Follow button and ellipsis container */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Pressable
          style={{
            paddingVertical: Spacing.m,
            paddingHorizontal: Spacing.l,
            borderRadius: 5,
            marginRight: Spacing.m,
            backgroundColor: Colors.ActionPrimary,
          }}
        >
          <Text
            style={{ color: Colors.TextOnSurfacePrimary, fontWeight: "600" }}
          >
            Follow
          </Text>
        </Pressable>
        <Ionicons
          name="ios-ellipsis-horizontal-sharp"
          size={24}
          color={Colors.IconNeutral}
        />
      </View>
    </View>
  );
};

const { width: POST_WIDTH } = Dimensions.get("window");

const Images = {
  profile: require("../../assets/docusaurus.png"),
  posts: [
    "https://cdn.pixabay.com/photo/2013/10/29/02/13/jardin-202150_960_720.jpg",
    "https://cdn.pixabay.com/photo/2020/06/20/02/56/dusk-5319496_960_720.jpg",
    "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
  ],
};
