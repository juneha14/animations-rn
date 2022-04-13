import React, { useCallback } from "react";
import { Text, Pressable, View, SectionList, StyleSheet } from "react-native";
import { Screen } from "./Routes";
import { useRouteNavigation } from "./useRoutes";
import { ANIMATIONS } from "./AnimationRoutes";
import { TRANSITIONS } from "./SharedElementRoutes";
import { Colors, Spacing } from "../theme";

const AnimationSection = {
  title: "Animations",
  data: ANIMATIONS,
};

const TransitionSection = {
  title: "Shared Element Transitions",
  data: TRANSITIONS,
};

const SECTIONS = [TransitionSection, AnimationSection];

export const Home = () => {
  const { navigate } = useRouteNavigation();

  const onNavigate = useCallback(
    (screen: Screen) => {
      navigate(screen);
    },
    [navigate]
  );

  return (
    <SectionList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyExtractor={(item) => item}
      sections={SECTIONS}
      renderItem={({ item }: { item: Screen }) => {
        return (
          <Pressable style={styles.row} onPress={() => onNavigate(item)}>
            <Text>{item}</Text>
          </Pressable>
        );
      }}
      renderSectionHeader={({ section: { title } }) => {
        return (
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        );
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.SurfaceBackground,
  },
  contentContainer: {
    paddingBottom: 50,
    backgroundColor: Colors.SurfaceBackground,
  },
  row: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 18,
  },
  sectionTitleContainer: {
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.SurfaceBackgroundPressed,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "400",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.Border,
  },
});
