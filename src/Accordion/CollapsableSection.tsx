import React, { useCallback } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons, Feather } from "@expo/vector-icons";
import { IconName, Section } from "./Accordion";

interface CollapsableSectionProps {
  section: Section;
  isExpandedInitially?: boolean;
}

export const CollapsableSection: React.FC<CollapsableSectionProps> = ({
  section,
  isExpandedInitially = false,
}) => {
  /// Height of the channels-list, so that it can animate expanding/collapsing
  /// If we want the channels-list to be expanded initially,
  ///   - keep height undefined until render is complete and height of list has been calculated (see onLayout)
  ///   - if it's set to 0, it causes a janky animation as height continues to update as onLayout completes
  /// If we want the channels-list to be closed initially,
  ///   - set default value to 1 so that children can get rendered correctly
  const height = useSharedValue<number | null>(isExpandedInitially ? null : 1);

  /// Keep track of whether or not the channels-list is expanded
  const expanded = useSharedValue(isExpandedInitially);

  /// Derived value denoting the progress of the expansion/collapse of the channels-list
  /// 1 === list is fully expanded
  /// 0 === list is fully closed
  const progress = useDerivedValue(() => {
    return withTiming(expanded.value ? 1 : 0);
  });

  const channelListAnimatedStyle = useAnimatedStyle(() => {
    return {
      // Adding +1pt height is the KEY trick here so that the child height can be measured
      height: height.value ? height.value * progress.value + 1 : undefined,
      opacity: progress.value,
    };
  });

  const onHeaderPress = useCallback(() => {
    expanded.value = !expanded.value;
  }, [expanded]);

  return (
    <View style={styles.sectionContainer}>
      <SectionHeader
        title={section.group}
        iconName={section.icon}
        iconColor={section.iconColor}
        onPress={onHeaderPress}
        progress={progress}
      />
      <Animated.View style={[{ overflow: "hidden" }, channelListAnimatedStyle]}>
        <View
          onLayout={({
            nativeEvent: {
              layout: { height: h },
            },
          }) => {
            height.value = h;
          }}
        >
          {section.channels.map((channel) => {
            return <ChannelRow key={channel} title={channel} />;
          })}
        </View>
      </Animated.View>
      <View />
    </View>
  );
};

const SectionHeader = ({
  title,
  iconName,
  iconColor,
  onPress,
  progress,
}: {
  title: string;
  iconName: IconName;
  iconColor: string;
  onPress: () => void;
  progress: Animated.SharedValue<number>;
}) => {
  const chevronAnimatedStyle = useAnimatedStyle(() => {
    // progress === 1 --> rotateZ = 0 (expanded)
    // progress === 0 --> rotateZ = -PI/2 (closed)
    const rotateZ = ((progress.value - 1) * Math.PI) / 2;
    return {
      transform: [
        {
          rotateZ: `${rotateZ}rad`,
        },
      ],
    };
  });

  return (
    <Pressable style={styles.sectionHeader} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Ionicons
          style={{ marginRight: 12, textAlign: "center" }}
          name={iconName}
          size={24}
          color={iconColor}
        />
        <Text>{title}</Text>
      </View>
      <Animated.View style={chevronAnimatedStyle}>
        <Ionicons name="ios-chevron-down-outline" size={24} />
      </Animated.View>
    </Pressable>
  );
};

const ChannelRow = ({ title }: { title: string }) => {
  return (
    <View style={styles.row}>
      <Feather
        style={{ marginLeft: 2, marginRight: 16, textAlign: "center" }}
        name="hash"
        size={20}
        color="#6F7377"
      />
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
});
