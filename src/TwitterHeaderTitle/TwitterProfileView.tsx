import React, { useEffect, useMemo } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

// Title and opacity of navigation header title
// Blur nav bar
// due to content translationY, the bottom gets cutoff
// think about possible converting the profile image to an absolute position to fix the 'bouncing' effect when scrolling to top

type NavBarHeight = { max: number; min: number };

export const TwitterProfileView: React.FC = () => {
  const { top } = useSafeAreaInsets();
  const NAV_BAR_HEIGHTS: NavBarHeight = useMemo(() => {
    return {
      max: top + 90,
      min: top + 46,
    };
  }, [top]);

  const { setOptions } = useNavigation();
  const offsetY = useSharedValue(0);

  useEffect(() => {
    setOptions({
      header: () => {
        return (
          <NavigationHeader offsetY={offsetY} navBarHeight={NAV_BAR_HEIGHTS} />
        );
      },
    });
  }, [setOptions, offsetY, NAV_BAR_HEIGHTS]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      offsetY.value = e.contentOffset.y;
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      offsetY.value,
      [0, NAV_BAR_HEIGHTS.max - NAV_BAR_HEIGHTS.min],
      [
        0,
        NAV_BAR_HEIGHTS.max - NAV_BAR_HEIGHTS.min - Spacing.m - (70 - 70 * 0.6),
      ],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        {
          translateY,
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={onScroll}
      scrollEventThrottle={16} // This is important! We are telling ScrollView to call onScroll every 16ms = 1/60fps
    >
      <Animated.View style={animatedStyle}>
        <ProfileHeader offsetY={offsetY} navBarHeight={NAV_BAR_HEIGHTS} />
        <TweetsList />
      </Animated.View>
    </Animated.ScrollView>
  );
};

const Images = {
  profile: require("../../assets/docusaurus.png"),
  header: require("../../assets/docusaurus-header.jpeg"),
};

const { width } = Dimensions.get("window");

const NavigationHeader = ({
  offsetY,
  navBarHeight,
}: {
  offsetY: Animated.SharedValue<number>;
  navBarHeight: NavBarHeight;
}) => {
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      offsetY.value,
      [0, navBarHeight.max - navBarHeight.min],
      [navBarHeight.max, navBarHeight.min],
      Extrapolate.CLAMP
    );

    return { height };
  });

  return (
    <>
      <Animated.Image
        style={[
          {
            width: width,
            height: navBarHeight.max,
          },
          animatedStyle,
        ]}
        source={Images.header}
      />
      <View
        style={{
          position: "absolute",
          top: top,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: width,
          paddingHorizontal: 10,
        }}
      >
        <Pressable onPress={() => goBack()}>
          <Ionicons name="arrow-back-circle" size={38} />
        </Pressable>
        <Text
          style={{
            color: Colors.TextOnSurfacePrimary,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Docusaurus
        </Text>
        <Pressable>
          <Ionicons name="search-circle" size={38} />
        </Pressable>
      </View>
    </>
  );
};

const ProfileHeader = ({
  offsetY,
  navBarHeight,
}: {
  offsetY: Animated.SharedValue<number>;
  navBarHeight: NavBarHeight;
}) => {
  const profileImageContainerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      offsetY.value,
      [0, navBarHeight.max - navBarHeight.min],
      [1, 0.6],
      Extrapolate.CLAMP
    );

    // Maintain the same spacing distance between profile picture and username while scaling
    const bottomDelta = 0.5 * (70 - 70 * scale);
    const delta = bottomDelta + Spacing.m + 2;

    const translateY = interpolate(
      offsetY.value,
      [0, navBarHeight.max - navBarHeight.min],
      [0, delta],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY: translateY }],
    };
  });

  return (
    <>
      <View style={[styles.profileHeaderImageButtonContainer]}>
        <Animated.Image
          style={[styles.profileImage, profileImageContainerStyle]}
          source={Images.profile}
        />
        <Pressable style={styles.followButton}>
          <Text style={{ color: Colors.TextOnSurfacePrimary }}>Follow</Text>
        </Pressable>
      </View>
      <View style={styles.profileUsernameContainer}>
        <Text style={{ fontWeight: "bold", fontSize: 22 }}>Docusaurus</Text>
        <Text style={{ color: Colors.TextSubdued }}>@docusaurus</Text>
      </View>
      <View>
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
    </>
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
                style={[
                  styles.profileImage,
                  { width: 50, height: 50, borderRadius: 25 },
                ]}
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

const IconForType = {
  location: {
    name: "ios-location-outline",
    title: "Menlo Park, CA",
    interactive: true,
  },
  link: {
    name: "ios-link-outline",
    title: "v2.docusaurus.io",
    interactive: true,
  },
  calendar: {
    name: "calendar-outline",
    title: "Joined August 2017",
    interactive: false,
  },
};
type Icon = keyof typeof IconForType;
type IconName = keyof typeof Ionicons.glyphMap;

const IconLabel = ({
  type,
  style,
}: {
  type: Icon;
  style?: StyleProp<ViewStyle>;
}) => {
  return (
    <View style={[styles.iconLabel, style]}>
      <Ionicons
        style={{ marginRight: 2 }}
        name={IconForType[type].name as IconName}
        size={18}
        color={Colors.IconSubdued}
      />
      <Text
        style={{
          color: IconForType[type].interactive
            ? Colors.TextInteractive
            : Colors.TextSubdued,
        }}
      >
        {IconForType[type].title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.defaultMargin,
    backgroundColor: Colors.SurfaceBackground,
  },
  profileHeaderImageButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Spacing.m,
  },
  profileImage: {
    width: 70,
    height: 70,
    resizeMode: "center",
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.BorderSubdued,
  },
  followButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: Colors.ActionPrimary,
  },
  profileUsernameContainer: {
    marginVertical: Spacing.m,
  },
  iconLabel: {
    flexDirection: "row",
    alignItems: "center",
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
