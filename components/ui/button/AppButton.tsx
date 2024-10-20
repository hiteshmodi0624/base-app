import { ViewStyle, TextStyle } from "react-native";
import { appColors } from "../../../Statics";
import React from "react";
import { handleUrlClick } from "@/utils";
import BlankButton from "./BlankButton";
import AppText from "@/components/typography/AppText";

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
const AppButton = ({
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
        (variant === 1 ? "transparent" : appColors.lightBlue),
      ...style,
    };

    const buttonTextStyle: TextStyle = {
      fontSize: sizes[size].fontSize,
      color:
        variant === 1
          ? (textColor ?? appColors.buttonGreen)
          : appColors.darkBlue,
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
      <AppText
        textStyles={{ ...buttonTextStyle, ...textStyle }}
        text={actionLabel}
      />
    </BlankButton>
  );
};

export default AppButton;
