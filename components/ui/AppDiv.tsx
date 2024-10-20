import React from "react";
import { View } from "react-native";
import { PropsWithChildren } from "react";

const AppDiv = ({ children } : PropsWithChildren ) => {
  return <View>{children}</View>;
};

export default AppDiv;
