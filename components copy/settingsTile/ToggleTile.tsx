import React, { useState } from 'react';
import BlankTile from './BlankTile';
import usePrefs from '../../hooks/usePrefs';
import useSubscription from '@/hooks/useSubscription';
import ToggleSwitch from '../ui/ToggleSwitch';

interface ToggleTileProps {
  title: string;
  userSettingsKey?: DitchPrefsOfValueType<boolean>;
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
  userSettingsKey,
  title,
  subtitle,
  toggleFunction,
  disabled = false,
  fontSizeIndex,
  showSubtitle = false,
  onDisabledClick,
  subscriptionLock = false,
}: ToggleTileProps) => {
  const { getPref, setPref } = usePrefs();
  const { isSubscribed, onlySubscribers } = useSubscription();
  const [value, setValue] = useState(
    subscriptionLock && !isSubscribed
      ? false
      : initialValue !== undefined
        ? initialValue
        : userSettingsKey
          ? getPref(userSettingsKey)
          : true,
  );
  const handleChange = (value: boolean) => {
    if (userSettingsKey) {
      setPref(userSettingsKey, value);
    }
    if (toggleFunction) {
      toggleFunction(value);
    }
    setValue(value);
  };

  const disabledHandler = () => {
    if (disabled && onDisabledClick) onDisabledClick();
    if (subscriptionLock && !isSubscribed) onlySubscribers(() => {});
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
        disabled={disabled || (subscriptionLock && !isSubscribed)}
        disabledHandler={disabledHandler}
      />
    </BlankTile>
  );
};

export default ToggleTile;
