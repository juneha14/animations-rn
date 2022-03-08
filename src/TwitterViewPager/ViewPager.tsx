/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { clamp, Colors, Spacing } from "../utils";

export const ViewPager: React.FC = () => {
  const scrollX = useSharedValue(0);
  const scrollRef = useAnimatedRef<any>();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  return (
    <>
      <PagerMenu
        contentScrollX={scrollX}
        onSelectOption={(index) => {
          scrollRef.current?.scrollTo({ x: index * WIDTH, animated: true });
        }}
      />
      <Animated.ScrollView
        style={{ backgroundColor: Colors.SurfaceForeground }}
        ref={scrollRef}
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        onScroll={onScroll}
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

const PagerMenu = ({
  contentScrollX,
  onSelectOption,
}: {
  contentScrollX: Animated.SharedValue<number>;
  onSelectOption: (index: number) => void;
}) => {
  const options = DATA.map((d) => d.sectionTitle);

  const menuScrollX = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      menuScrollX.value = e.contentOffset.x;
    },
  });

  const contentInterpolateInputRange = DATA.map((_, index) => index * WIDTH);

  const scrollViewAnimatedProps = useAnimatedProps(() => {
    const last = DATA[DATA.length - 1].layout;
    const maxOffset = Math.abs(last.x + last.w + Spacing.s * 2 - WIDTH);
    const outputRange = DATA.map(({ layout }, index) => {
      if (index === 0) {
        return 0;
      }

      const offset = (DATA[index - 1].layout.x + layout.x) / 2;
      return clamp(offset, 0, maxOffset);
    });

    const offsetX = interpolate(
      contentScrollX.value,
      contentInterpolateInputRange,
      outputRange,
      Extrapolate.CLAMP
    );

    return {
      contentOffset: { x: offsetX, y: 0 },
    };
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const left = interpolate(
      contentScrollX.value,
      contentInterpolateInputRange,
      DATA.map(({ layout }) => layout.x)
    );

    const width = interpolate(
      contentScrollX.value,
      contentInterpolateInputRange,
      DATA.map(({ layout }) => layout.w)
    );

    return {
      left: left - menuScrollX.value,
      width,
    };
  });

  return (
    <View
      style={{
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: Colors.Border,
        backgroundColor: Colors.SurfaceForeground,
      }}
    >
      <Animated.ScrollView
        contentContainerStyle={{ flexGrow: 1 }} // Allows content to take up full even space when it's not overflowing/requires scrolling (e.g. when there's just two options, we want both to fill the entire width equally)
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        animatedProps={scrollViewAnimatedProps}
      >
        {options.map((title, index) => {
          return (
            <OptionButton
              key={`${title} + ${index}`}
              contentScrollX={contentScrollX}
              index={index}
              title={title}
              onPress={() => {
                onSelectOption(index);
              }}
            />
          );
        })}
      </Animated.ScrollView>

      {/* Indicator */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 46,
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
  contentScrollX,
  index,
  title,
  onPress,
}: {
  contentScrollX: Animated.SharedValue<number>;
  index: number;
  title: string;
  onPress: () => void;
}) => {
  const aStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      contentScrollX.value,
      [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
      [Colors.TextNeutral, Colors.IconInteractive, Colors.TextNeutral]
    );

    const scale = interpolate(
      contentScrollX.value,
      [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
      [1, 1.08, 1],
      Extrapolate.CLAMP
    );

    return {
      color,
      transform: [
        {
          scale,
        },
      ],
    };
  });

  return (
    <Pressable
      style={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: Spacing.s,
        paddingHorizontal: Spacing.s,
      }}
      onPress={onPress}
    >
      <Animated.Text style={aStyle}>{title}</Animated.Text>
    </Pressable>
  );
};

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
      style={{ width: WIDTH }}
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

const { width: WIDTH } = Dimensions.get("window");

type DataSource = {
  sectionTitle: string;
  profileUri: string;
  count: number;
  layout: { x: number; w: number };
};

const DATA: DataSource[] = [
  {
    sectionTitle: "Tweets",
    profileUri:
      "https://cdn.pixabay.com/photo/2016/09/16/15/56/manhattan-1674404_960_720.jpg",
    count: 3,
    layout: { x: 4, w: 54 },
  },
  {
    sectionTitle: "Tweets & replies",
    profileUri:
      "https://cdn.pixabay.com/photo/2016/09/16/15/56/manhattan-1674404_960_720.jpg",
    count: 9,
    layout: { x: 66, w: 114.33 },
  },
  {
    sectionTitle: "Likes",
    profileUri:
      "https://cdn.pixabay.com/photo/2013/10/29/02/13/jardin-202150_960_720.jpg",
    count: 9,
    layout: { x: 188.33, w: 41.33 },
  },
  {
    sectionTitle: "Entertainment",
    profileUri:
      "https://cdn.pixabay.com/photo/2016/09/16/15/56/manhattan-1674404_960_720.jpg",
    count: 12,
    layout: { x: 237.66, w: 99.33 },
  },
  {
    sectionTitle: "Bookmarked",
    profileUri:
      "https://cdn.pixabay.com/photo/2016/09/16/15/56/manhattan-1674404_960_720.jpg",
    count: 5,
    layout: { x: 345, w: 89 },
  },
  {
    sectionTitle: "Favourites",
    profileUri:
      "https://cdn.pixabay.com/photo/2020/06/20/02/56/dusk-5319496_960_720.jpg",
    count: 7,
    layout: { x: 442, w: 74.33 },
  },
  {
    sectionTitle: "Saved",
    profileUri:
      "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
    count: 3,
    layout: { x: 524.33, w: 47.33 },
  },
];
