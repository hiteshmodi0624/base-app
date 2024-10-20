import React, { useState } from 'react';
import BlankTile from './BlankTile';
import ToggleSwitch from '../ui/ToggleSwitch';

interface ToggleTileProps {
  title: string;
  initialValue?: boolean;
  toggleFunction?: (value: boolean) => void;
  disabled?: boolean;
  subtitle?: string;
  icon?: React.JSX.Element;
  fontSizeIndex?: number;
  showSubtitle?: boolean;
  onDisabledClick?: () => void;
  subscriptionLock?: boolean;
}

const ToggleTile = ({
  initialValue,
  icon,
  title,
  subtitle,
  toggleFunction,
  disabled = false,
  fontSizeIndex,
  showSubtitle = false,
  onDisabledClick,
  subscriptionLock = false,
}: ToggleTileProps) => {
  const [value, setValue] = useState(
    subscriptionLock ? false : initialValue !== undefined ? initialValue : true
  );
  const handleChange = (value: boolean) => {
    if (toggleFunction) {
      toggleFunction(value);
    }
    setValue(value);
  };

  const disabledHandler = () => {
    if (disabled && onDisabledClick) onDisabledClick();
  }

  return (
    <BlankTile
      icon={icon}
      title={title}
      subtitle={subtitle}
      hideNextIcon
      titleFontSizeIndex={fontSizeIndex}
      showSubtile={showSubtitle}
      onClickHandler={disabledHandler}
    >
      <ToggleSwitch
        value={disabled ? false : value}
        onValueChange={handleChange}
        disabledHandler={disabledHandler}
      />
    </BlankTile>
  );
};

export default ToggleTile;
