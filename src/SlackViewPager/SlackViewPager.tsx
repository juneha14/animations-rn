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
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { Colors, Spacing } from "../utils";

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
        scrollX={scrollX}
        onSelectOption={(index) => {
          scrollRef.current?.scrollTo({ x: index * WIDTH });
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

type MenuOptionDimensions = Record<number, { x: number; w: number }>;
type UpdateDimensionRequest = { index: number; x: number; w: number };

const PagerMenu = ({
  scrollX,
  onSelectOption,
}: {
  scrollX: Animated.SharedValue<number>;
  onSelectOption: (index: number) => void;
}) => {
  const options = DATA.map((d) => d.sectionTitle);

  const dimensionsForIndex = useRef<MenuOptionDimensions>({});
  const updateDimensionsQueue = useRef<UpdateDimensionRequest[]>([]);
  const isUpdatingDimensions = useRef(false);

  const updateDimensions = (index: number, w: number, x: number) => {
    const recurse = () => {
      const dimension = updateDimensionsQueue.current.pop();
      if (dimension === undefined) {
        isUpdatingDimensions.current = false;
        return;
      }

      isUpdatingDimensions.current = true;
      dimensionsForIndex.current[index] = { x, w };
      recurse();
    };

    updateDimensionsQueue.current.push({ index, w, x });
    if (!isUpdatingDimensions.current) {
      recurse();
    }
  };

  const indicatorAnimatedStyle = useAnimatedStyle(() => {
    const left = interpolate(
      scrollX.value,
      [0, WIDTH, 2 * WIDTH, 3 * WIDTH],
      [4, 133, 215, 330]
    );

    const width = interpolate(
      scrollX.value,
      [0, WIDTH, 2 * WIDTH, 3 * WIDTH],
      [121, 74, 106, 80]
    );

    return {
      left,
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {options.map((title, index) => {
          return (
            <OptionButton
              key={`${title} + ${index}`}
              index={index}
              title={title}
              onLayout={(e) => {
                const w = e.nativeEvent.layout.width;
                const x = e.nativeEvent.layout.x;
                console.log("==== Value of w for index:", index, w);
                // console.log("==== Value of x for index:", index, x);
                // updateDimensions(index, w, x);
              }}
              onPress={() => {
                // indicatorX.value = withTiming(
                //   dimensionsForIndex.current[index].x
                // );
                onSelectOption(index);
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
  onLayout,
  onPress,
}: {
  index: number;
  title: string;
  onLayout: (event: LayoutChangeEvent) => void;
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
      onLayout={onLayout}
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
  //   {
  //     sectionTitle: "Really long title to see how this will fit",
  //     profileUri:
  //       "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
  //     count: 13,
  //   },
  //   {
  //     sectionTitle: "Hello, how are you?",
  //     profileUri:
  //       "https://cdn.pixabay.com/photo/2017/08/22/11/33/autumn-2668630_960_720.jpg",
  //     count: 13,
  //   },
];
