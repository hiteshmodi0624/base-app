import { openBrowserAsync } from "expo-web-browser";
import { Linking, Platform } from "react-native";

export const getImageSource = (iconName: string) => {
  switch (iconName) {
    case "place_place.png":
      return require("../assets/images/place_place.png");
    default:
      return require("../assets/images/place_place.png");
  }
};

export const handleUrlClick = async (link: string) => {
  if (Platform.OS !== "web") {
    await openBrowserAsync(link);
  } else {
    Linking.openURL(link);
  }
};