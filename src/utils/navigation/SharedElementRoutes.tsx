import React from "react";
import {
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import { Screen, StackRouteParamList } from "./Routes";

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
      <Stack.Screen name="Airbnb" component={AirbnbListingsScreen} />
      <Stack.Screen
        name="Airbnb Details"
        component={AirbnbListingDetailsScreen}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
          transitionSpec: {
            open: { animation: "timing", config: { duration: 3000 } },
            close: { animation: "timing", config: { duration: 3000 } },
          },
          cardStyleInterpolator: ({ current: { progress } }) => {
            return {
              cardStyle: {
                opacity: progress,
              },
            };
          },
        }}
        initialParams={{ listing: undefined }}

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
    </>
  );
};
