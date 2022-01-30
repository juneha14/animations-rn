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
import { InterpolateColors } from "../Fundamentals/Reanimated/InterpolateColors";
import { InterpolateScrollView } from "../Fundamentals/Reanimated/InterpolateScrollView";
import { Colors, Spacing } from "./theme";
import { TwitterProfileView } from "../TwitterHeaderTitle/TwitterProfileView";

type StackRouteParamList = {
  Home: undefined;

  // Animations:
  Accordion: undefined;
  BottomSheet: undefined;
  InterpolateScrollView: undefined;
  InterpolateColors: undefined;
  ShowMoreText: undefined;
  TwitterHeaderTitle: undefined;
};

type Screen = keyof StackRouteParamList;
const ANIMATIONS: Screen[] = [
  "Accordion",
  "BottomSheet",
  "InterpolateScrollView",
  "InterpolateColors",
  "ShowMoreText",
  "TwitterHeaderTitle",
];

const Stack = createNativeStackNavigator<StackRouteParamList>();

export const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Accordion" component={Accordion} />
        <Stack.Screen name="BottomSheet" component={BottomSheet} />
        <Stack.Screen name="ShowMoreText" component={ShowMoreText} />
        <Stack.Screen
          name="TwitterHeaderTitle"
          component={TwitterProfileView}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="InterpolateScrollView"
          component={InterpolateScrollView}
        />
        <Stack.Screen name="InterpolateColors" component={InterpolateColors} />
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
            style={{ padding: Spacing.defaultMargin }}
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
