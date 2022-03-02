import React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";

export const SlackViewPager: React.FC = () => {
  return (
    <>
      <PagerMenu />
      <Animated.ScrollView
        style={{ backgroundColor: Colors.SurfaceForeground }}
        contentContainerStyle={
          {
            // backgroundColor: Colors.SurfaceForeground,
            // backgroundColor: "red",
          }
        }
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
      >
        {DATA.map((data, index) => {
          return (
            <Page
              key={`${data.profileUri} + ${index}`}
              index={index}
              profileUri={data.profileUri}
              data={[...Array(data.count).keys()]}
            />
          );
        })}
      </Animated.ScrollView>
    </>
  );
};

const PagerMenu = () => {
  const options = DATA.map((d) => d.sectionTitle);

  const indicatorX = useSharedValue(0);
  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    return {
      left: indicatorX.value,
    };
  });

  return (
    <View
      style={{
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: Colors.Border,
        backgroundColor: Colors.SurfaceForeground,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        horizontal
      >
        {options.map((title, index) => {
          return (
            <OptionButton
              key={`${title} + ${index}`}
              index={index}
              title={title}
              onPress={() => {
                indicatorX.value = withTiming(216);
              }}
            />
          );
        })}
      </ScrollView>

      {/* Indicator */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 48,
            width: 50,
            height: 2,
            backgroundColor: Colors.IconInteractive,
          },
          indicatorAnimatedStyle,
        ]}
      />
    </View>
  );
};

const OptionButton = ({
  index,
  title,
  onPress,
}: {
  index: number;
  title: string;
  onPress: () => void;
}) => {
  return (
    <Pressable
      style={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: Spacing.s,
        backgroundColor: "pink",
      }}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        const x = e.nativeEvent.layout.x;
        // console.log("==== Value of w for index:", index, w);
        console.log("==== Value of x for index:", index, x);
      }}
      onPress={onPress}
    >
      <Text>{title}</Text>
    </Pressable>
  );
};

const { width: WIDTH } = Dimensions.get("window");

const Page = ({
  index,
  profileUri,
  data,
}: {
  index: number;
  profileUri: string;
  data: number[];
}) => {
  return (
    <ScrollView
      style={{
        width: WIDTH,
        // backgroundColor: "pink"
      }}
      contentContainerStyle={{
        paddingHorizontal: Spacing.l,
        paddingTop: Spacing.l,
      }}
    >
      {data.map((val) => {
        return (
          <View
            key={val}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: Spacing.l,
            }}
          >
            <Image
              source={{ uri: profileUri }}
              style={{ width: 50, height: 50, borderRadius: 10 }}
            />
            <View style={{ marginLeft: Spacing.m }}>
              <Text
                style={{ fontWeight: "600", fontSize: 16, marginBottom: 3 }}
              >
                {`John Doe ${index}`}
              </Text>
              <Text style={{ color: Colors.TextSubdued, fontSize: 13 }}>
                Senior React Native Developer
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

type DataSource = {
  sectionTitle: string;
  profileUri: string;
  count: number;
};

const DATA: DataSource[] = [
  {
    sectionTitle: "Bookmarked",
    profileUri:
      "https://cdn.pixabay.com/photo/2016/09/16/15/56/manhattan-1674404_960_720.jpg",
    count: 5,
  },
  {
    sectionTitle: "Likes",
    profileUri:
      "https://cdn.pixabay.com/photo/2013/10/29/02/13/jardin-202150_960_720.jpg",
    count: 9,
  },
  {
    sectionTitle: "Favourites",
    profileUri:
      "https://cdn.pixabay.com/photo/2020/06/20/02/56/dusk-5319496_960_720.jpg",
    count: 7,
  },
  {
    sectionTitle: "Saved",
    profileUri:
      "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
    count: 3,
  },
];
