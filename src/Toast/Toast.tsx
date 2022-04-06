/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  Easing,
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

type _ToastKeyedProps = _ToastProps & { key: number };
let key = 0;

export const Toast: React.FC<ToastProps> = React.forwardRef((_, ref) => {
  const [props, setProps] = useState<_ToastKeyedProps[]>([]);

  useImperativeHandle(ref, () => {
    return {
      show: (props: _ToastProps) => {
        key = key + 1;
        setProps((prev) => {
          const keyedProp = { ...props, key };
          return [keyedProp, ...prev];
        });
      },
    };
  });

  const onDismiss = useCallback(
    (prop: _ToastKeyedProps) => () => {
      setProps((prev) => {
        return prev.filter((p) => p.key !== prop.key);
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
        // NOTE: Key must be unique (and not change) per _Toast component.
        // If we simply use the `index` as the key, then the component will not maintain its identity across state updates.
        // The `index` will not be the same as the original key that the component was given when there is a state update (i.e. setProps)
        return (
          <_Toast key={prop.key} props={prop} onDismiss={onDismiss(prop)} />
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

  const hiddenOffsetY = -(containerHeight + Spacing.m + 10);
  const translateY = useSharedValue(hiddenOffsetY);

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
  useLayoutEffect(() => {
    if (!rendered.current && containerHeight > 0) {
      rendered.current = true;

      translateY.value = withSequence(
        withTiming(hiddenOffsetY, { duration: 0 }),
        withTiming(0, { duration: 500 }, () => {
          runOnJS(setToastTimeout)();
        })
      );
    }
  }, [translateY, hiddenOffsetY, containerHeight, setToastTimeout]);

  useEffect(() => {
    return () => clearToastTimeout();
  }, [clearToastTimeout]);

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
        layout={Layout.duration(400).easing(Easing.linear)}
        // entering={SlideInUp.easing(Easing.out(Easing.exp)).duration(1000)}
        // exiting={FadeOutUp}
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
