/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

export const Toast: React.FC = () => {
  return (
    <>
      <ToastView />

      <ScrollView
        style={{ backgroundColor: Colors.SurfaceBackground }}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable style={[styles.button, styles.success]}>
          <Text style={styles.buttonText}>Show success toast</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.informative]}>
          <Text style={styles.buttonText}>Show information toast</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.error]}>
          <Text style={styles.buttonText}>Show error toast</Text>
        </Pressable>
      </ScrollView>
    </>
  );
};

const ToastView = () => {
  const [status, setStatus] = useState<Status>("success");
  const [containerHeight, setContainerHeight] = useState(0);
  const timeoutId = useRef<any>(null);

  const translateY = useSharedValue(0);
  const hiddenOffsetY = -(containerHeight + Spacing.m + 10);
  const { backgroundColor, borderColor, iconName } = stylesForStatus(status);

  const setToastTimeout = useCallback(() => {
    timeoutId.current = setTimeout(() => {
      translateY.value = withTiming(hiddenOffsetY, { duration: 500 });
    }, 3000);
  }, [translateY, hiddenOffsetY, timeoutId]);

  const clearToastTimeout = useCallback(() => {
    clearTimeout(timeoutId.current);
  }, [timeoutId]);

  useEffect(() => {
    if (containerHeight > 0 && translateY.value === 0) {
      translateY.value = withSequence(
        withTiming(hiddenOffsetY, { duration: 0 }),
        withDelay(
          500,
          withTiming(0, { duration: 500 }, () => {
            runOnJS(setToastTimeout)();
          })
        )
      );
    }
  }, [translateY, hiddenOffsetY, containerHeight, setToastTimeout]);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(clearToastTimeout)();
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      if (translateY.value >= 0) {
        translateY.value = withTiming(0);
        runOnJS(setToastTimeout)();
      } else {
        translateY.value = withTiming(hiddenOffsetY);
        runOnJS(clearToastTimeout)();
      }
    });

  const aStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(translateY.value, [-30, 0, 30], [-30, 0, 3]),
        },
      ],
      opacity: interpolate(
        translateY.value,
        [hiddenOffsetY, hiddenOffsetY / 2, 0],
        [0, 0.5, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          {
            position: "absolute",
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: Spacing.l,
            margin: Spacing.m,
            borderRadius: 10,
            borderColor,
            borderWidth: 0.5,
            shadowColor: "#171717",
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 3 },
            backgroundColor,
            zIndex: 1,
          },
          aStyle,
        ]}
        onLayout={(e) => {
          if (containerHeight === 0) {
            const { height } = e.nativeEvent.layout;
            setContainerHeight(height);
          }
        }}
      >
        <View
          style={{
            flex: 3,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name={iconName} size={25} color={borderColor} />
          <Text
            style={{
              flexShrink: 1,
              color: Colors.TextOnSurfaceNeutral,
              marginLeft: Spacing.m,
            }}
          >
            Tweet added to your Bookmarks
          </Text>
        </View>

        {status === "error" ? (
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            <Text
              style={{
                color: Colors.TextOnSurfaceCritical,
                textDecorationLine: "underline",
              }}
            >
              Learn more
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
};

type Status = "success" | "informative" | "error";

type StatusStyle = {
  backgroundColor: string;
  borderColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
};

const stylesForStatus = (status: Status): StatusStyle => {
  switch (status) {
    case "success": {
      return {
        backgroundColor: Colors.SurfaceSuccess,
        borderColor: Colors.BorderSuccess,
        iconName: "ios-checkmark-circle-outline",
      };
    }
    case "informative": {
      return {
        backgroundColor: Colors.SurfaceNeutral,
        borderColor: Colors.IconNeutral,
        iconName: "ios-information-circle-outline",
      };
    }
    case "error": {
      return {
        backgroundColor: Colors.SurfaceCritical,
        borderColor: Colors.BorderCritical,
        iconName: "ios-warning-outline",
      };
    }
  }
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 60,
    borderRadius: 10,
    marginBottom: Spacing.defaultMargin,
  },
  success: {
    backgroundColor: Colors.SurfaceSuccess,
  },
  informative: {
    backgroundColor: Colors.SurfaceNeutral,
  },
  error: {
    backgroundColor: Colors.SurfaceCritical,
  },
  buttonText: {
    color: Colors.TextInteractive,
  },
});
