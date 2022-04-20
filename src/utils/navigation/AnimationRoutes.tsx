import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { Screen, StackRouteParamList } from "./Routes";

import Accordion from "../../Accordion";
import BottomSheet from "../../BottomSheet";
import ShowMoreText from "../../ShowMoreText";
import TwitterProfileView from "../../TwitterProfile";
import FloatingActionButton from "../../FloatingActionButton";
import InstagramBookmark from "../../InstagramBookmark";
import AppleMail from "../../AppleMail";
import DragToSortList from "../../DragToSortList";
import ViewPager from "../../TwitterViewPager";
import AppleWeather from "../../StickySectionHeader";
import CardWallet from "../../CardWallet";
import ProgressButtons from "../../ProgressButtons";
import Toast from "../../Toast";
import Counter from "../../Counter";
import { InterpolateColors } from "../../Fundamentals/Reanimated/InterpolateColors";
import { InterpolateScrollView } from "../../Fundamentals/Reanimated/InterpolateScrollView";

const stackWrapper = () =>
  createSharedElementStackNavigator<StackRouteParamList>();
type Stack = ReturnType<typeof stackWrapper>;

export const ANIMATIONS: Screen[] = [
  "Accordion",
  "Apple Mail",
  "Apple Weather",
  "Bottom Sheet",
  "Card Wallet",
  "Counter",
  "Drag to Sort List",
  "Floating Action Button",
  "Instagram Bookmark",
  "Interpolate ScrollView",
  "Interpolate Colors",
  "Progress Buttons",
  "Show More Text",
  "Toast",
  "Twitter Profile",
  "Twitter View Pager",
];

export const AnimationRoutes = (Stack: Stack) => {
  return (
    <>
      <Stack.Screen name="Accordion" component={Accordion} />
      <Stack.Screen name="Apple Mail" component={AppleMail} />
      <Stack.Screen
        name="Apple Weather"
        component={AppleWeather}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Bottom Sheet" component={BottomSheet} />
      <Stack.Screen name="Card Wallet" component={CardWallet} />
      <Stack.Screen name="Counter" component={Counter} />
      <Stack.Screen name="Drag to Sort List" component={DragToSortList} />
      <Stack.Screen
        name="Floating Action Button"
        component={FloatingActionButton}
      />
      <Stack.Screen name="Instagram Bookmark" component={InstagramBookmark} />
      <Stack.Screen name="Progress Buttons" component={ProgressButtons} />
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
    </>
  );
};
