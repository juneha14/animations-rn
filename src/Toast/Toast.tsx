/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  Layout,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Colors, Spacing } from "../utils";
import { Ionicons } from "@expo/vector-icons";

export interface ToastRef {
  show: (props: _ToastProps) => void;
}

interface ToastProps {
  ref: Ref<ToastRef>;
}

export const Toast: React.FC<ToastProps> = React.forwardRef((_, ref) => {
  const [props, setProps] = useState<_ToastProps[]>([]);

  useImperativeHandle(ref, () => {
    return {
      show: (props: _ToastProps) => {
        setProps((prev) => {
          return [props, ...prev];
        });
      },
    };
  });

  const onDismiss = useCallback(
    (prop: _ToastProps) => () => {
      setProps((prev) => {
        return prev.filter((p) => p.message !== prop.message);
      });
    },
    []
  );

  return (
    <Animated.View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        margin: Spacing.m,
        zIndex: 1,
      }}
    >
      {props.map((prop) => {
        return (
          <_Toast key={prop.message} props={prop} onDismiss={onDismiss(prop)} /> // TODO: KEY has to be unique!
        );
      })}
    </Animated.View>
  );
});

const _Toast = ({
  props,
  onDismiss,
}: {
  props: _ToastProps;
  onDismiss: () => void;
}) => {
  const [containerHeight, setContainerHeight] = useState(0);
  const rendered = useRef(false);
  const timeoutId = useRef<any>(null);

  const translateY = useSharedValue(0);

  const hiddenOffsetY = -(containerHeight + Spacing.m + 10);
  const { backgroundColor, borderColor, iconName } = stylesForStatus(
    props.type
  );

  const setToastTimeout = useCallback(() => {
    timeoutId.current = setTimeout(() => {
      translateY.value = withTiming(hiddenOffsetY, { duration: 500 }, () => {
        runOnJS(onDismiss)();
      });
    }, 3000);
  }, [translateY, hiddenOffsetY, timeoutId, onDismiss]);

  const clearToastTimeout = useCallback(() => {
    clearTimeout(timeoutId.current);
  }, [timeoutId]);

  // Initial custom FadeIn and SlideDown animation to show Toast
  // Doing it like this allows us to control the animation parameters more granularly (also allows us to set the toast timeout)
  // Simpler way would be to use the entering/exiting props of the Animated.View
  useEffect(() => {
    if (containerHeight > 0 && translateY.value === 0 && !rendered.current) {
      rendered.current = true;
      translateY.value = withSequence(
        withTiming(hiddenOffsetY, { duration: 0 }),
        withTiming(0, { duration: 500 }, () => {
          runOnJS(setToastTimeout)();
        })
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
        // Panned down, so just reset to the origin position
        translateY.value = withTiming(0);
        runOnJS(setToastTimeout)();
      } else {
        // Panned up, so user wants to dismiss the toast
        translateY.value = withTiming(hiddenOffsetY, undefined, () => {
          runOnJS(onDismiss)();
        });
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
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: Spacing.l,
            marginBottom: Spacing.m,
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
        // This `layout` prop allows us to smoothly animate the new layout position of this view when
        // it is re-rendered because new items are added/removed from the parent (i.e. setState)
        layout={Layout.springify().damping(10)}
        // entering={SlideInLeft}
        // exiting={SlideOutLeft}
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

        {props.type === "error" ? (
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
            }}
            onPress={props.onPress}
          >
            <Text
              style={{
                color: Colors.TextOnSurfaceCritical,
                textDecorationLine: "underline",
              }}
            >
              {props.actionTitle}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
};

interface SuccessProps {
  type: "success";
  message: string;
}

interface ErrorProps {
  type: "error";
  message: string;
  actionTitle?: string;
  onPress?: () => void;
}

interface InfoProps {
  type: "informative";
  message: string;
}

type _ToastProps = SuccessProps | ErrorProps | InfoProps;

type Status = _ToastProps["type"];

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
