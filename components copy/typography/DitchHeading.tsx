import React from 'react';
import { Text, TextStyle } from 'react-native';

interface DitchHeadingProps {
  text: string;
  fontSizeIndex?: number;
  styles?: TextStyle;
  fontWeightIndex?: number;
  fontFamily?: 'Montserrat' | 'Arial';
}

const DitchHeading = ({ text, fontSizeIndex = 3, styles = {}, fontWeightIndex = 1, fontFamily = 'Arial' }: DitchHeadingProps) => {
  const fontSizes = [16, 18, 24, 32];
  const fontWeights = ['200', '400', '600', '800'];
  return (
    <Text
      style={[
        {
          fontSize: fontSizes[fontSizeIndex],
          fontWeight: fontWeights[fontWeightIndex] as any,
          marginVertical: 0,
          fontFamily: fontFamily,
        },
        styles,
      ]}
    >
      {text}
    </Text>
  );
};

export default DitchHeading;
