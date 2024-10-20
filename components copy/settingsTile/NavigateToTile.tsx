import React from "react";
import BlankTile from "./BlankTile";
import useUtils from "../../hooks/useUtils";
import { ScreenName } from "@/types/App";

interface NavigateToTileProps {
  title: string;
  icon?: React.JSX.Element;
  navigateTo: ScreenName;
  subtitle?: string;
}

const NavigateToTile = ({ icon, navigateTo, title } : NavigateToTileProps) => {
  const { navigateTo: navigate } = useUtils();
  return (
    <BlankTile
      icon={icon}
      onClickHandler={() => navigate(navigateTo)}
      title={title}
      
    />
  );
};
export default NavigateToTile;
