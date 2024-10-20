import React from "react";
import {
  Animated,
  ImageLoadEventData,
  ImageSourcePropType,
  ImageStyle,
  NativeSyntheticEvent,
  View,
  ViewStyle,
} from "react-native";
import BlankButton from "./button/BlankButton";
interface DitchImageProps {
  imageUrl?: string;
  size?: number | Animated.Value;
  opacity?: number;
  onClick?: () => void;
  image?: ImageSourcePropType;
  style?: ViewStyle;
  onLoad?: (event: NativeSyntheticEvent<ImageLoadEventData>) => void;
  imageStyle?: ImageStyle | ImageStyle[];
}
const DitchImage = ({
  imageUrl,
  size = 25,
  opacity = 1,
  style,
  onClick,
  image,
  onLoad,
  imageStyle
}: DitchImageProps) => {
  return onClick ? (
    <BlankButton onClickHandler={onClick} style={style}>
      <Animated.Image
        source={image ?? { uri: `/assets/images/${imageUrl}` }}
        style={[{ width: size, height: size, opacity }, imageStyle]}
        onLoad={onLoad}
      />
    </BlankButton>
  ) : (
    <View>
      <Animated.Image
        source={image ?? { uri: `/assets/images/${imageUrl}` }}
        style={[{ width: size, height: size, opacity, resizeMode: 'contain' }, imageStyle]}
        onLoad={onLoad}
      />
    </View>
  );
};

export default DitchImage;
