import React, { Ref, useImperativeHandle, useRef, useState } from "react";
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
  useDerivedValue,
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
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// User tab icon wiggle animation

export const InstagramBookmark: React.FC = () => {
  const bookmarkPreviewRef = useRef<BookmarkPreviewRef>(null);

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ backgroundColor: Colors.SurfaceBackground }}
      >
        {[...Array(3).keys()].map((val) => {
          return (
            <Post
              key={val}
              index={val}
              onBookmarkPress={(bookmarked) => {
                if (bookmarked) {
                  const imgUri = Images.posts[val];
                  bookmarkPreviewRef.current?.showPreview(imgUri);
                }
              }}
            />
          );
        })}
      </ScrollView>
      <TabBar />
      <BookmarkPreview ref={bookmarkPreviewRef} />
    </>
  );
};

interface BookmarkPreviewProps {
  ref: Ref<BookmarkPreviewRef>;
}

interface BookmarkPreviewRef {
  showPreview: (imgUri: string) => void;
}

const BookmarkPreview: React.FC<BookmarkPreviewProps> = React.forwardRef(
  (props, ref) => {
    const { bottom, right } = useSafeAreaInsets();

    const imgUris = useRef<string[]>([]);
    const isAnimationInProgress = useRef(false);
    const [currentImgUri, setCurrentImgUri] = useState<string>();

    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const zIndex = useSharedValue(-1);

    const aStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
        opacity: opacity.value,
        zIndex: zIndex.value,
      };
    });

    const runAnimation = (completion: () => void) => {
      "worklet";

      opacity.value = 1;
      zIndex.value = 1;
      scale.value = withTiming(1, { duration: 200 }, () => {
        scale.value = withDelay(800, withTiming(0.5));
        translateY.value = withDelay(
          800,
          withTiming(120, undefined, () => {
            // Animation finished. Reset all values so that next animation can occur properly
            scale.value = 0;
            translateY.value = 0;
            opacity.value = 0;
            zIndex.value = -1;
            runOnJS(completion)();
          })
        );
      });
    };

    const recurse = () => {
      if (imgUris.current.length === 0) {
        isAnimationInProgress.current = false;
        return;
      }

      isAnimationInProgress.current = true;
      const uri = imgUris.current.pop();
      setCurrentImgUri(uri);

      runAnimation(() => {
        recurse();
      });
    };

    // This is the KEY!!
    // This hook allows us to call a function of a child component imperatively - perfect for these queue-based type animations
    useImperativeHandle(ref, () => {
      return {
        showPreview: (imgUri) => {
          imgUris.current.push(imgUri);

          if (!isAnimationInProgress.current) {
            recurse();
          }
        },
      };
    });

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
  }
);

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
        zIndex: 2,
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

const Post = ({
  index,
  onBookmarkPress,
}: {
  index: number;
  onBookmarkPress: (bookmarked: boolean) => void;
}) => {
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <View style={{ paddingVertical: Spacing.m, marginBottom: 5 }}>
      <ProfileOverview index={index} />
      <PostImage bookmarked={bookmarked} index={index} />
      <PostContent
        bookmarked={bookmarked}
        onBookmarkPress={() => {
          setBookmarked((b) => {
            onBookmarkPress(!b);
            return !b;
          });
        }}
      />
    </View>
  );
};

const PostImage = ({
  bookmarked,
  index,
}: {
  bookmarked: boolean;
  index: number;
}) => {
  const translateY = useSharedValue(41);

  useAnimatedReaction(
    () => bookmarked,
    (b) => {
      if (b) {
        translateY.value = withSequence(
          withTiming(0),
          withDelay(800, withTiming(41))
        );
      }
    },
    [bookmarked]
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PostContent = ({
  bookmarked,
  onBookmarkPress,
}: {
  bookmarked: boolean;
  onBookmarkPress: () => void;
}) => {
  const progress = useDerivedValue(() => {
    if (!bookmarked) return 1;

    return withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  }, [bookmarked]);

  const bookmarkButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: progress.value,
        },
      ],
    };
  });

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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: 90,
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
        <AnimatedPressable
          style={[
            {
              alignItems: "flex-end",
              marginRight: 8,
            },
            bookmarkButtonAnimatedStyle,
          ]}
          onPress={() => {
            if (!bookmarked) {
              // Bookmark is being set to true, so enable haptic feedback
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            }
            onBookmarkPress();
          }}
        >
          <Ionicons
            name={bookmarked ? "ios-bookmark" : "ios-bookmark-outline"}
            size={25}
            color="black"
          />
        </AnimatedPressable>
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
