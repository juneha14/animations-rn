import React, { Ref, useImperativeHandle, useRef, useState } from "react";
import { Image } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface BookmarkThumbnailProps {
  ref: Ref<BookmarkThumbnailRef>;
}

export interface BookmarkThumbnailRef {
  showPreview: (imgUri: string, completion: () => void) => void;
}

type PendingAnimation = {
  imgUri: string;
  completion: () => void;
};

/**
 * The mini thumbnail preview of the post image that is shown on top of the User tab bar when post is bookmarked.
 */
export const BookmarkThumbnail: React.FC<BookmarkThumbnailProps> =
  React.forwardRef((props, ref) => {
    const { bottom, right } = useSafeAreaInsets();

    const pendingAnimations = useRef<PendingAnimation[]>([]);
    const isAnimationInProgress = useRef(false);
    const [currentImgUri, setCurrentImgUri] = useState<string>();

    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);
    const zIndex = useSharedValue(-1);

    const aStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }, { translateY: translateY.value }],
        opacity: opacity.value,
        zIndex: zIndex.value,
      };
    });

    const runAnimation = (completion: () => void) => {
      "worklet";

      opacity.value = 1;
      zIndex.value = 1;
      scale.value = withTiming(1, { duration: 200 }, () => {
        scale.value = withDelay(800, withTiming(0.4));
        translateY.value = withDelay(
          800,
          withTiming(120, undefined, () => {
            // Animation finished. Reset all values so that next animation can occur properly
            scale.value = 0;
            translateY.value = 0;
            opacity.value = 0;
            zIndex.value = -1;
            runOnJS(completion)();
          })
        );
      });
    };

    const recurse = () => {
      if (pendingAnimations.current.length === 0) {
        isAnimationInProgress.current = false;
        return;
      }

      isAnimationInProgress.current = true;
      const animation = pendingAnimations.current.pop();
      setCurrentImgUri(animation?.imgUri);

      runAnimation(() => {
        animation?.completion();
        recurse();
      });
    };

    // This is the KEY!!
    // This hook allows us to call a function of a child component imperatively - perfect for these queue-based type animations
    useImperativeHandle(ref, () => {
      return {
        showPreview: (imgUri, completion) => {
          pendingAnimations.current.push({ imgUri, completion });

          if (!isAnimationInProgress.current) {
            recurse();
          }
        },
      };
    });

    return (
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: bottom + 24 + 12 + 10,
            right: right + 15,
          },
          aStyle,
        ]}
      >
        {currentImgUri && (
          <Image
            source={{ uri: currentImgUri }}
            style={{ width: 50, height: 50 }}
          />
        )}
      </Animated.View>
    );
  });
