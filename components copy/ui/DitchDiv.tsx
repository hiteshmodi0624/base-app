import React from "react";
import { View } from "react-native";
import { PropsWithChildren } from "react";

const DitchDiv = ({ children } : PropsWithChildren ) => {
  return <View>{children}</View>;
};

export default DitchDiv;
