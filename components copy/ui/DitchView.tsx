import { View, type ViewProps } from "react-native";
import React from "react";

export type DitchViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function DitchView({ ...otherProps }: DitchViewProps) {
  return <View {...otherProps} />;
}
