import { MaterialIcons } from '@expo/vector-icons';
import { appColors } from '../../Statics';
import { GestureResponderEvent, StyleProp, TextStyle } from 'react-native';
import React, { ComponentProps } from 'react';

export type IconNames = ComponentProps<typeof MaterialIcons>['name'];

interface AppIconProps {
  name: IconNames;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  onClick?: (event: GestureResponderEvent) => void;
}
const AppIcon = ({ name, size = 24, color = appColors.darkBlue, style, onClick }: AppIconProps) => {
  return <MaterialIcons name={name} size={size} color={color} style={style} onPress={onClick} />;
};
export default AppIcon;
