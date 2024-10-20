import { MaterialIcons } from '@expo/vector-icons';
import { ditchColors } from '../../DitchStatics';
import { GestureResponderEvent, StyleProp, TextStyle } from 'react-native';
import React, { ComponentProps } from 'react';

export type IconNames = ComponentProps<typeof MaterialIcons>['name'];

interface DitchIconProps {
  name: IconNames;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  onClick?: (event: GestureResponderEvent) => void;
}
const DitchIcon = ({ name, size = 24, color = ditchColors.darkBlue, style, onClick }: DitchIconProps) => {
  return <MaterialIcons name={name} size={size} color={color} style={style} onPress={onClick} />;
};
export default DitchIcon;
