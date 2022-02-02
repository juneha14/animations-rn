import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NavigationHeader } from "./NavigationHeader";
import { useNavBarHeightProvider, Images } from "./utils/utils";
import { IconLabel } from "./utils/IconLabel";
import { Colors, Spacing } from "../utils";

export const TwitterProfileView: React.FC = () => {
  const { NAV_BAR_MAX_HEIGHT, NAV_BAR_MIN_HEIGHT } = useNavBarHeightProvider();

  const offsetY = useSharedValue(0);
  const usernameDimensions = useSharedValue({ height: 0, y: 0 });

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      offsetY.value = e.contentOffset.y;
    },
  });

  return (
    <>
      <NavigationHeader
        offsetY={offsetY}
        usernameDimensions={usernameDimensions}
      />
      <Animated.ScrollView
        style={[
          styles.container,

          // These are the key!
          // marginTop - Allows scrollView content to scroll underneath the navigation header when it reaches the NAV_BAR_MIN_HEIGHT
          // paddingTop - Allows scrollView content to originally show at the NAV_BAR_MAX_HEIGHT. This padding gets smaller as you scroll up and gets bigger as you scroll down. Having this padding on the container and NOT the contentContainer makes the content scroll children respect its padding
          // zIndex - Have zIndex of scrollView higher than the navigation header. This allows the scrollView to scroll on top of the navigation header banner. This can be easily seen if you remove the translationY style on the navigation header
          {
            marginTop: NAV_BAR_MIN_HEIGHT,
            paddingTop: NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT,
            zIndex: 2,
          },
        ]}
        contentContainerStyle={{
          paddingHorizontal: Spacing.defaultMargin,
          paddingBottom: NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT, // Balance bottom offset from container's paddingTop so that all tweets can be shown. Without this offset, scrollView content container will be cutoff at the bottom
          backgroundColor: Colors.SurfaceBackground,
        }}
        onScroll={onScroll}
        scrollEventThrottle={16} // This is important! We are telling ScrollView to call onScroll every 16ms = 1/60fps
      >
        <ProfileHeader
          offsetY={offsetY}
          onLayoutUsernameContainer={({ height, y }) => {
            usernameDimensions.value = { height, y };
          }}
        />
        <TweetsList />
      </Animated.ScrollView>
    </>
  );
};

const ProfileHeader = ({
  offsetY,
  onLayoutUsernameContainer,
}: {
  offsetY: Animated.SharedValue<number>;
  onLayoutUsernameContainer: ({
    height,
    y,
  }: {
    height: number;
    y: number;
  }) => void;
}) => {
  const { NAV_BAR_MAX_HEIGHT, NAV_BAR_MIN_HEIGHT } = useNavBarHeightProvider();
  const { right } = useSafeAreaInsets();

  const profileImageAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      offsetY.value,
      [0, NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT],
      [1, 0.6],
      Extrapolate.CLAMP
    );

    // Maintain the same spacing distance between profile picture and username while scaling
    const delta = 0.5 * (83 - 83 * 0.6) + Spacing.m; // (PICTURE_HEIGHT - SCALED_PICTURE_HEIGHT) / 2 + (some weird bottom offset when image is scaled which causes the image to not be flush to the bottom with the translation)
    const translateY = interpolate(
      offsetY.value,
      [0, NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT],
      [0, delta],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY: translateY }],
    };
  });

  return (
    <View>
      <Animated.Image
        style={[
          styles.profileImage,
          { marginTop: -(0.5 * (83 - 83 * 0.6) + Spacing.m + 5) }, // Offset marginTop by the same `delta` translationY of the image. This will allow the image to scale and move in-line with the bottom of the navigation header (thus removing whitespace that will be caused without the marginTop offset)
          profileImageAnimatedStyle,
        ]}
        source={Images.profile}
      />
      <Pressable style={[styles.followButton, { right }]}>
        <Text style={{ color: Colors.TextOnSurfacePrimary }}>Follow</Text>
      </Pressable>

      <View
        style={styles.profileUsernameContainer}
        onLayout={(e) => {
          const layout = e.nativeEvent.layout;
          const y = layout.y + NAV_BAR_MAX_HEIGHT - NAV_BAR_MIN_HEIGHT;
          const height = layout.height;
          onLayoutUsernameContainer({ height, y });
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Docusaurus</Text>
        <Text style={{ color: Colors.TextSubdued }}>@docusaurus</Text>
      </View>

      <Text style={{ fontSize: 16 }}>
        Build optimized websites quickly, focus on your content. Part of Remix
        and Shopify.
      </Text>
      <View style={styles.locationLinkContainer}>
        <IconLabel type="location" />
        <IconLabel type="link" style={{ marginLeft: Spacing.l }} />
      </View>
      <IconLabel type="calendar" style={{ marginTop: Spacing.m }} />

      <View style={styles.followerContainer}>
        <Text style={{ marginRight: Spacing.l }}>35 Following</Text>
        <Text>3,677 Followers</Text>
      </View>
    </View>
  );
};

const TweetsList = () => {
  return (
    <View style={styles.tweetsListContainer}>
      <View>
        <View style={styles.tweetCategoryContainer}>
          <Text
            style={{
              fontWeight: "700",
              fontSize: 15,
              marginBottom: Spacing.s,
            }}
          >
            Tweets
          </Text>
          <Text>{`Tweets & replies`}</Text>
          <Text>Media</Text>
          <Text>Likes</Text>
        </View>
        <View style={styles.divider} />
      </View>
      {[...Array(20).keys()].map((val) => {
        return (
          <View key={val}>
            <View style={styles.tweet}>
              <Image
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: Colors.BorderSubdued,
                }}
                source={Images.profile}
              />
              <View style={{ marginLeft: Spacing.m, flexShrink: 1 }}>
                <Text style={{ marginBottom: Spacing.s }}>
                  Docusaurus @docusaurus · 2022-01-24
                </Text>
                <Text>
                  {`Docusaurus is a new project from @fbOpenSource team to easily manage your open source project documentation + ${val}`}
                </Text>
              </View>
            </View>
            <View style={styles.divider} />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.BorderSubdued,
    resizeMode: "center",
  },
  followButton: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.s,
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: Colors.ActionPrimary,
  },
  profileUsernameContainer: {
    marginVertical: Spacing.m,
  },
  locationLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.m,
  },
  followerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  tweetsListContainer: {
    marginTop: Spacing.defaultMargin,
  },
  tweetCategoryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tweet: {
    flexDirection: "row",
    paddingVertical: Spacing.defaultMargin,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.BorderSubdued,
  },
});
