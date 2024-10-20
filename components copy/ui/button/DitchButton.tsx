import { ViewStyle, TextStyle } from "react-native";
import { ditchColors } from "../../../DitchStatics";
import React from "react";
import { handleUrlClick } from "@/utils";
import DitchText from "@/components/typography/DitchText";
import BlankButton from "./BlankButton";

interface NewButtonProps {
  actionUrl?: string;
  actionHandler?: () => void;
  actionLabel: string;
  size?: number;
  style?: ViewStyle;
  variant?: number;
  backgroundColor?: string;
  textColor?: string;
  textStyle?: TextStyle;
}
const DitchButton = ({
  actionUrl,
  actionHandler,
  actionLabel,
  size = 1,
  variant = 0,
  backgroundColor,
  style,
  textColor,
  textStyle,
}: NewButtonProps) => {
  const sizes = [
    {
      paddingY: 10,
      fontSize: 14,
    },
    {
      paddingY: 15,
      fontSize: 18,
    },
  ];

  const getButtonStyle = () => {
    const baseButtonStyle: ViewStyle = {
      paddingVertical: sizes[size].paddingY,
      paddingHorizontal: 30,
      borderRadius: 100,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      backgroundColor:
        backgroundColor ??
        (variant === 1 ? "transparent" : ditchColors.lightBlue),
      ...style,
    };

    const buttonTextStyle: TextStyle = {
      fontSize: sizes[size].fontSize,
      color:
        variant === 1
          ? (textColor ?? ditchColors.buttonGreen)
          : ditchColors.darkBlue,
      textAlign: "center",
    };

    return { baseButtonStyle, buttonTextStyle };
  };

  const { baseButtonStyle, buttonTextStyle } = getButtonStyle();

  const handlePress = async () => {
    if (actionUrl) {
      handleUrlClick(actionUrl);
    }
    if (actionHandler) {
      actionHandler();
    }
  };

  return (
    <BlankButton style={baseButtonStyle} onClickHandler={handlePress}>
      <DitchText
        textStyles={{ ...buttonTextStyle, ...textStyle }}
        text={actionLabel}
      />
    </BlankButton>
  );
};

export default DitchButton;
