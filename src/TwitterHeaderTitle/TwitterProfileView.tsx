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
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TwitterProfileView: React.FC = () => {
  const { setOptions } = useNavigation();

  useEffect(() => {
    setOptions({
      header: () => {
        return <NavigationHeader />;
      },
    });
  }, [setOptions]);

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader />
      <TweetsList />
    </ScrollView>
  );
};

const Images = {
  profile: require("../../assets/docusaurus.png"),
  header: require("../../assets/docusaurus-header.jpeg"),
};

const { width } = Dimensions.get("window");

const NavigationHeader = () => {
  const { top, left, right } = useSafeAreaInsets();
  const { goBack } = useNavigation();

  return (
    <View>
      <ImageBackground
        style={{
          width: width,
          height: 90 + top,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        source={Images.header}
      >
        <Pressable onPress={() => goBack()}>
          <Ionicons
            style={{
              marginLeft: 10 + left,
              marginTop: top,
            }}
            name="arrow-back-circle"
            size={38}
          />
        </Pressable>
        <Text
          style={{
            marginTop: top + 10,
            color: Colors.TextOnSurfacePrimary,
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Docusaurus
        </Text>
        <Pressable>
          <Ionicons
            style={{
              marginRight: 10 + right,
              marginTop: top,
            }}
            name="search-circle"
            size={38}
          />
        </Pressable>
      </ImageBackground>
      <View />
    </View>
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
