import React from "react";
import BlankButton from "../ui/button/BlankButton";
import AppIcon from "../ui/AppIcon";
import { StyleSheet } from "react-native";

const CloseButton = ({
  onCloseHandler,
  position,
  size,
  color,
}: {
  onCloseHandler: () => void;
  position?: number;
  size?: number;
  color?: string;
}) => {
  return (
    <BlankButton style={[styles.closeIcon, { top: position ?? 15, right: position ?? 15 }]} onClickHandler={onCloseHandler}>
      <AppIcon name="close" size={size ?? 24} color={color ?? 'black'} />
    </BlankButton>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  closeIcon: {
    position: 'absolute',
    cursor: 'pointer',
    zIndex: 100,
  },
});