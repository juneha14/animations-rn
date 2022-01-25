import React, { useEffect } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
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

// Scale of profile image
// Title and opacity of navigation header title

export const TwitterProfileView: React.FC = () => {
  const { setOptions } = useNavigation();
  const offsetY = useSharedValue(0);

  useEffect(() => {
    setOptions({
      header: () => {
        return <NavigationHeader offsetY={offsetY} />;
      },
    });
  }, [setOptions, offsetY]);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      offsetY.value = e.contentOffset.y;
    },
  });

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={onScroll}
      scrollEventThrottle={16} // This is important! We are telling ScrollView to call onScroll every 16ms = 1/60fps
    >
      <ProfileHeader />
      <TweetsList />
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
}: {
  offsetY: Animated.SharedValue<number>;
}) => {
  const { top } = useSafeAreaInsets();
  const { goBack } = useNavigation();

  const NAV_BAR_MAX_HEIGHT = top + 90;
  const NAV_BAR_MIN_HEIGHT = top + 48;

  const animatedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      offsetY.value,
      [0, NAV_BAR_MAX_HEIGHT],
      [NAV_BAR_MAX_HEIGHT, NAV_BAR_MIN_HEIGHT],
      Extrapolate.CLAMP
    );

    return {
      height,
    };
  });

  return (
    <>
      <Animated.Image
        style={[
          {
            width: width,
            height: NAV_BAR_MAX_HEIGHT,
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

const ProfileHeader = () => {
  return (
    <View>
      <View style={styles.profileHeaderImageButtonContainer}>
        <Image style={styles.profileImage} source={Images.profile} />
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
    marginTop: Spacing.s,
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
    marginVertical: Spacing.defaultMargin,
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
