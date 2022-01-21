import React, { useCallback, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextLayoutEventData,
  View,
  Text,
} from "react-native";
import Animated, {
  useSharedValue,
  useDerivedValue,
  withTiming,
  useAnimatedStyle,
  withSpring,
  runOnUI,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { Spacing } from "../utils";

interface ShowMoreTextProps {
  collapsedNumberOfLines?: number;
}

export const ShowMoreText: React.FC<ShowMoreTextProps> = ({
  collapsedNumberOfLines = 2,
}) => {
  /// The collapsed text height
  /// Since there is no adequate padding (i.e. no fixed size) on the Text child component, we cannot simply use
  /// the same idea that was used for Accordion. There isn't enough initial fixed height such that height continues to
  /// increase as we update it via onLayout. This causes the height to get 'stuck'.
  const height = useSharedValue(0);

  /// Scale factor determined by expandedHeight/collapsedHeight
  /// Factor === 1 when text is collapsed
  /// Factor === x when text is expanded
  /// Multiply collapsedHeight with factor to determine animatedStyle size
  const heightScaleFactor = useSharedValue(0);

  /// Denotes whether the text is collapsed or not
  const collapsed = useSharedValue(true);

  // Limitation of sharedValue where we cannot access the latest value on JS side
  // when the sharedValue is updated. We have to wait for the next render-cycle before the latest
  // value is reflected on JS side
  const [jsCollapsed, setJsCollapsed] = useState(true);
  const setCollapsedOnJS = (collapsed: boolean) => setJsCollapsed(collapsed);

  // Observe changes to the collapsed shared value and update JS state
  // so that 'Show more' / 'Show less' button text is shown correctly
  useAnimatedReaction(
    () => collapsed.value,
    (val) => {
      runOnJS(setCollapsedOnJS)(val);
    },
    []
  );

  const progress = useDerivedValue(() => {
    return collapsed.value
      ? withTiming(1)
      : withSpring(heightScaleFactor.value);
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: height.value === 0 ? undefined : height.value * progress.value,
    };
  });

  const onToggle = useCallback(() => {
    runOnUI(() => {
      "worklet";
      collapsed.value = !collapsed.value;
    })();
  }, [collapsed]);

  const onTextLayout = useCallback(
    (event: NativeSyntheticEvent<TextLayoutEventData>) => {
      if (height.value === 0) {
        const lineHeights = event.nativeEvent.lines.map((l) => l.height);

        const collapsedHeight = lineHeights
          .slice(0, collapsedNumberOfLines)
          .reduce((prev, curr) => prev + curr);
        const expandedHeight = lineHeights.reduce((prev, curr) => prev + curr);

        height.value = collapsedHeight;
        heightScaleFactor.value = expandedHeight / collapsedHeight;
      }
    },
    [height, heightScaleFactor, collapsedNumberOfLines]
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[{ overflow: "hidden" }, textAnimatedStyle]}>
        <View>
          <Text onTextLayout={onTextLayout}>
            LINE 1: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
            o eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enimad minim veniam, qumad minim veniam, quis nostmad minim veniam,
            quis nostmad minim veniam eniam, quis nost eniam, quis nost, quis
            nostis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat. Duis aute irure dolor in END OF LINE
          </Text>
        </View>
      </Animated.View>
      <Pressable style={styles.showButton} onPress={onToggle}>
        <Text style={styles.showButtonText}>
          {jsCollapsed ? "Show more" : "Show less"}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.defaultMargin,
  },
  showButton: {
    marginTop: 5,
  },
  showButtonText: {
    color: "#2E72D2",
  },
});
