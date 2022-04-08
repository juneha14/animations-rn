import React, { useCallback } from "react";
import { Text, FlatList, Pressable, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";

import Accordion from "../Accordion";
import BottomSheet from "../BottomSheet";
import ShowMoreText from "../ShowMoreText";
import TwitterProfileView from "../TwitterProfile";
import FloatingActionButton from "../FloatingActionButton";
import InstagramBookmark from "../InstagramBookmark";
import AppleMail from "../AppleMail";
import DragToSortList from "../DragToSortList";
import ViewPager from "../TwitterViewPager";
import AppleWeather from "../StickySectionHeader";
import CardWallet from "../CardWallet";
import ProgressButtons from "../ProgressButtons";
import Toast from "../Toast";
import { InterpolateColors } from "../Fundamentals/Reanimated/InterpolateColors";
import { InterpolateScrollView } from "../Fundamentals/Reanimated/InterpolateScrollView";
import { Colors, Spacing } from "./theme";

import {
  InstagramGridScreen,
  InstagramPostDetailsScreen,
  InstagramPostType,
} from "../SharedElementTransition/Instagram";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { enableScreens } from "react-native-screens";
// import InstagramPostDetailsScreen from "../SharedElementTransition/Instagram/InstagramPostDetailsScreen";

export type StackRouteParamList = {
  Home: undefined;

  // Animations:
  Accordion: undefined;
  "Apple Mail": undefined;
  "Apple Weather": undefined;
  "Bottom Sheet": undefined;
  "Card Wallet": undefined;
  "Drag to Sort List": undefined;
  "Floating Action Button": undefined;
  "Instagram Bookmark": undefined;
  "Interpolate ScrollView": undefined;
  "Interpolate Colors": undefined;
  "Progress Buttons": undefined;
  "Show More Text": undefined;
  Toast: undefined;
  "Twitter Profile": undefined;
  "Twitter View Pager": undefined;

  // Shared element transitions:
  "Shared Transition - Instagram": undefined;
  "Shared Transition - Instagram Details": { post: InstagramPostType };
};

export type Screen = keyof StackRouteParamList;

const ANIMATIONS: Screen[] = [
  "Accordion",
  "Apple Mail",
  "Apple Weather",
  "Bottom Sheet",
  "Card Wallet",
  "Drag to Sort List",
  "Floating Action Button",
  "Instagram Bookmark",
  "Interpolate ScrollView",
  "Interpolate Colors",
  "Progress Buttons",
  "Shared Transition - Instagram",
  "Show More Text",
  "Toast",
  "Twitter Profile",
  "Twitter View Pager",
];

enableScreens(false);
const Stack = createSharedElementStackNavigator<StackRouteParamList>();

export const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerBackTitle: " " }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Accordion" component={Accordion} />
        <Stack.Screen name="Apple Mail" component={AppleMail} />
        <Stack.Screen
          name="Apple Weather"
          component={AppleWeather}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Bottom Sheet" component={BottomSheet} />
        <Stack.Screen name="Card Wallet" component={CardWallet} />
        <Stack.Screen name="Drag to Sort List" component={DragToSortList} />
        <Stack.Screen
          name="Floating Action Button"
          component={FloatingActionButton}
        />
        <Stack.Screen name="Instagram Bookmark" component={InstagramBookmark} />
        <Stack.Screen name="Progress Buttons" component={ProgressButtons} />

        <Stack.Screen
          name="Shared Transition - Instagram"
          component={InstagramGridScreen}
        />
        <Stack.Screen
          name="Shared Transition - Instagram Details"
          component={InstagramPostDetailsScreen}
          options={{
            headerShown: false,
            // transitionSpec: {
            //   open: { animation: "timing", config: { duration: 500 } },
            //   close: { animation: "timing", config: { duration: 500 } },
            // },
            // cardStyleInterpolator: ({ current: { progress } }) => {
            //   return {
            //     cardStyle: {
            //       opacity: progress,
            //     },
            //   };
            // },
          }}
          initialParams={{ post: undefined }}

          // sharedElements={(route, otherRoute, showing) => {
          //   const { post } = route.params;
          //   return [
          //     {
          //       id: post.id,
          //       animation: "move",
          //     },
          //   ];
          // }}
        />

        <Stack.Screen name="Show More Text" component={ShowMoreText} />
        <Stack.Screen name="Toast" component={Toast} />
        <Stack.Screen
          name="Twitter Profile"
          component={TwitterProfileView}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Twitter View Pager" component={ViewPager} />
        <Stack.Screen
          name="Interpolate ScrollView"
          component={InterpolateScrollView}
        />
        <Stack.Screen name="Interpolate Colors" component={InterpolateColors} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Home = () => {
  const { push } = useNavigation<StackNavigationProp<StackRouteParamList>>();

  const onPress = useCallback(
    (animation: Screen) => () => {
      push(animation);
    },
    [push]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Screen; index: number }) => {
      return (
        <>
          <Pressable
            style={{
              paddingHorizontal: Spacing.xl,
              paddingVertical: 18,
            }}
            onPress={onPress(item)}
          >
            <Text>{item}</Text>
          </Pressable>
          {index < ANIMATIONS.length - 1 ? (
            <View style={{ backgroundColor: Colors.Border, height: 1 }} />
          ) : null}
        </>
      );
    },
    [onPress]
  );

  return (
    <FlatList
      style={{ backgroundColor: Colors.SurfaceBackground }}
      contentContainerStyle={{
        paddingBottom: 50,
        backgroundColor: Colors.SurfaceBackground,
      }}
      keyExtractor={(item) => item}
      data={ANIMATIONS}
      renderItem={renderItem}
    />
  );
};
