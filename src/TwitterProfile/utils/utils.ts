import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Images = {
  profile: require("../../../assets/docusaurus.png"),
  header: require("../../../assets/docusaurus-header.jpeg"),
};

export const useNavBarHeightProvider = () => {
  const { top } = useSafeAreaInsets();
  return {
    NAV_BAR_MAX_HEIGHT: top + 90,
    NAV_BAR_MIN_HEIGHT: top + 46,
  };
};
