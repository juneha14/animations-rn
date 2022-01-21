import React, { useCallback } from "react";
import { Text, FlatList, Pressable, View } from "react-native";
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Accordion } from "../Accordion/Accordion";
import BottomSheet from "../BottomSheet";
import { Colors, Spacing } from "./theme";

type StackRouteParamList = {
  Home: undefined;

  // Animations:
  Accordion: undefined;
  BottomSheet: undefined;
  InterpolateScrollView: undefined;
  InterpolateColors: undefined;
  ShowMoreText: undefined;
};

type Screen = keyof StackRouteParamList;
const ANIMATIONS: Screen[] = [
  "Accordion",
  "BottomSheet",
  "InterpolateScrollView",
  "InterpolateColors",
  "ShowMoreText",
];

const Stack = createNativeStackNavigator<StackRouteParamList>();

export const Routes: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Accordion" component={Accordion} />
        <Stack.Screen name="BottomSheet" component={BottomSheet} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Home = () => {
  const { navigate } = useNavigation<NavigationProp<StackRouteParamList>>();

  const onPress = useCallback(
    (animation: Screen) => () => {
      navigate(animation);
    },
    [navigate]
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
