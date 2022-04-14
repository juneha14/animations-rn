import React from "react";
import { TransitionPresets } from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { Screen, StackRouteParamList } from "./Routes";
import { BlurView } from "expo-blur";
import {
  AirbnbListingsScreen,
  AirbnbListingDetailsScreen,
} from "../../SharedElementTransition/Airbnb";

const stackWrapper = () =>
  createSharedElementStackNavigator<StackRouteParamList>();
type Stack = ReturnType<typeof stackWrapper>;

export const TRANSITIONS: Screen[] = ["Airbnb"];

export const SharedElementRoutes = (Stack: Stack) => {
  return (
    <>
      <Stack.Screen
        name="Airbnb"
        component={AirbnbListingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Airbnb Details"
        component={AirbnbListingDetailsScreen}
        options={{
          //   ...TransitionPresets.ModalSlideFromBottomIOS,
          headerShown: false,
          transitionSpec: {
            open: { animation: "timing", config: { duration: 300 } },
            close: { animation: "timing", config: { duration: 300 } },
          },
          cardStyle: { backgroundColor: "transparent" },
          cardOverlayEnabled: true,
          detachPreviousScreen: false, // Needed when using `cardStyle` with transparent background so that the previous screen isn't detached and continues to show beneath
          gestureEnabled: false,
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
              overlayStyle: {
                opacity: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            };
          },
        }}
        // initialParams={{ listing: undefined }}
        sharedElements={(route) => {
          const { listing } = route.params;
          return [
            { id: `${listing.id}.photo`, resize: "clip" },
            {
              id: `${listing.id}.background`,
              animation: "fade",
              resize: "none",
            },
            // Order matters! If I put this above the `background` row, then this `content` does not animate
            { id: `${listing.id}.content`, animation: "fade", resize: "none" },
          ];
        }}
      />
    </>
  );
};
