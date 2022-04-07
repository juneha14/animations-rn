import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackRouteParamList, Screen } from "./Routes";

export function useRouteNavigation() {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackRouteParamList>>();
  return navigation;
}

export function useRouteParams<T extends Screen>(screen: T) {
  const params = useRoute<RouteProp<StackRouteParamList, typeof screen>>();
  return params;
}
