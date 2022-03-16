import React, { useCallback } from "react";
import { Text, FlatList, Pressable, View } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from "@react-navigation/native-stack";
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
import { InterpolateColors } from "../Fundamentals/Reanimated/InterpolateColors";
import { InterpolateScrollView } from "../Fundamentals/Reanimated/InterpolateScrollView";
import { Colors, Spacing } from "./theme";

type StackRouteParamList = {
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
  "Show More Text": undefined;
  "Twitter Profile": undefined;
  "Twitter View Pager": undefined;
};

type Screen = keyof StackRouteParamList;
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
  "Show More Text",
  "Twitter Profile",
  "Twitter View Pager",
];

const Stack = createNativeStackNavigator<StackRouteParamList>();

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
        <Stack.Screen name="Show More Text" component={ShowMoreText} />
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
  const { push } =
    useNavigation<NativeStackNavigationProp<StackRouteParamList>>();

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
      contentContainerStyle={{ backgroundColor: Colors.SurfaceBackground }}
      keyExtractor={(item) => item}
      data={ANIMATIONS}
      renderItem={renderItem}
    />
  );
};
