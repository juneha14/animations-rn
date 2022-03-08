/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { createRef, useRef } from "react";
import {
  Dimensions,
  Image,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
  ScrollView,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import { clamp, Colors, Spacing } from "../utils";

export const SlackViewPager: React.FC = () => {
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

  const scrollViewAnimatedProps = useAnimatedProps(() => {
    const x = interpolate(
      contentScrollX.value,
      MenuDimensions.map((_, index) => index * WIDTH),
      MenuDimensions.map((val) => {
        const total = val.x + val.w;
        return Math.floor(total / WIDTH) * val.x;
      })
    );

    const last = MenuDimensions[MenuDimensions.length - 1];
    const menuContentLength = last.x + last.w;
    const factor = Math.floor(menuContentLength / WIDTH);
    const max = Math.abs(menuContentLength - factor * WIDTH);

    return {
      contentOffset: { x: clamp(x, 0, max), y: 0 },
    };
  });

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const left = interpolate(
      contentScrollX.value,
      MenuDimensions.map((_, index) => index * WIDTH),
      MenuDimensions.map((val) => val.x)
    );

    const width = interpolate(
      contentScrollX.value,
      MenuDimensions.map((_, index) => index * WIDTH),
      MenuDimensions.map((val) => val.w)
    );

    return {
      left: left - menuScrollX.value,
      width,
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
      <Animated.ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
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
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                const x = e.nativeEvent.layout.x;
                // console.log("==== Value of w for index:", index, w);
                // console.log("==== Value of x for index:", index, x);
                // updateDimensions(index, w, x);
              }}
              onPress={() => {
                onSelectOption(index);
                // scrollRef.current.scrollTo({ x: 505 });
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
  contentScrollX,
  index,
  title,
  onLayout,
  onPress,
}: {
  contentScrollX: Animated.SharedValue<number>;
  index: number;
  title: string;
  onLayout: (event: LayoutChangeEvent) => void;
  onPress: () => void;
}) => {
  const aStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      contentScrollX.value,
      [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
      [Colors.TextNeutral, Colors.TextInteractive, Colors.TextNeutral]
    );

    const scale = interpolate(
      contentScrollX.value,
      [(index - 1) * WIDTH, index * WIDTH, (index + 1) * WIDTH],
      [1, 1.1, 1],
      Extrapolate.CLAMP
    );

    return {
      color,
      transform: [
        {
          scale: 1,
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
        backgroundColor: "pink",
      }}
      onLayout={onLayout}
      onPress={onPress}
    >
      <Animated.Text style={aStyle}>{title}</Animated.Text>
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

const MenuDimensions: { x: number; w: number }[] = [
  {
    x: 4,
    w: 81,
  },
  {
    x: 93,
    w: 33,
  },
  {
    x: 134,
    w: 66,
  },
  {
    x: 209,
    w: 40,
  },
  {
    x: 256,
    w: 241,
  },
  {
    x: 505,
    w: 126,
  },

  //   {
  //     x: 4,
  //     w: 121,
  //   },
  //   {
  //     x: 133,
  //     w: 74,
  //   },
  //   {
  //     x: 215,
  //     w: 106,
  //   },
  //   {
  //     x: 330,
  //     w: 80,
  //   },
];

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
  {
    sectionTitle: "Really long title to see how this will fit",
    profileUri:
      "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
    count: 13,
  },
  {
    sectionTitle: "Hello, how are you?",
    profileUri:
      "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
    count: 13,
  },
];
