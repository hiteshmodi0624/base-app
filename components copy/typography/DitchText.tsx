import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { TextProps } from "react-native-svg";

export type DitchTextProps = TextProps & {
  text: string | undefined;
  fontSizeIndex?: number;
  styles?: ViewStyle;
  fontWeightIndex?: number;
  textStyles?: TextStyle;
  fontFamily?: 'MontserratLight' | 'MontserratRegular' | 'MontserratMedium' | 'MontserratSemiBold' | 'MontserratBold' | 'Arial';
};

const DitchText = ({
  text = '',
  fontSizeIndex = 3,
  styles,
  fontWeightIndex = 1,
  textStyles,
  fontFamily,
  fontSize,
  ...rest
}: DitchTextProps) => {
  const textParts = typeof text === 'boolean' ? [] : text.toString().split('\n');
  const fontSizes = [12, 14, 16, 20, 26, 32];
  const fontWeights: (200 | 400 | 600 | 800)[] = [200, 400, 600, 800];

  return (
    <View style={[{ flexDirection: 'column', justifyContent: 'center', flexShrink: 1 }, styles]}>
      {textParts.map((part, index) => (
        <Text
          key={index}
          style={[
            {
              fontSize: fontSize ? +fontSize : fontSizes[fontSizeIndex],
              fontWeight: fontWeights[fontWeightIndex],
              marginVertical: 0,
              fontFamily: fontFamily
                ? fontFamily
                : fontWeightIndex === 0
                  ? 'MontserratLight'
                  : fontWeightIndex === 1
                    ? 'MontserratRegular'
                    : fontWeightIndex === 2
                      ? 'MontserratMedium'
                      : fontWeightIndex === 3
                        ? 'MontserratSemiBold'
                        : 'MontserratRegular',
            },
            textStyles,
          ]}
          {...rest}
        >
          {part}
        </Text>
      ))}
    </View>
  );
};

export default DitchText;
