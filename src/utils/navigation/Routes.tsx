import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { AnimationRoutes } from "./AnimationRoutes";
import { SharedElementRoutes } from "./SharedElementRoutes";
import { Home } from "./Home";
import { InstagramPostType } from "../../SharedElementTransition/Instagram";

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
  Airbnb: undefined;
  "Airbnb Details": { post: InstagramPostType };
};

export type Screen = keyof StackRouteParamList;

const Stack = createSharedElementStackNavigator<StackRouteParamList>();

export const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerBackTitle: " " }}
      >
        <Stack.Screen name="Home" component={Home} />
        {AnimationRoutes(Stack)}
        {SharedElementRoutes(Stack)}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
