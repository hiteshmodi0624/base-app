import React from "react";
import { View } from "react-native";

const Circle = ({ backgroundColor = '#000', diameter = 10 }: { backgroundColor?: string; diameter?: number }) => {
  return (
    <View
      style={{
        backgroundColor,
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
      }}
    />
  );
};

export default Circle;
