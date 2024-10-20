import { View, type ViewProps } from "react-native";
import React from "react";

export type AppViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export default function AppView({ ...otherProps }: AppViewProps) {
  return <View {...otherProps} />;
}
