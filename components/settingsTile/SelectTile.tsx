import React, { useState } from 'react';
import { ConfirmActionType } from '../shared/ConfirmAction';
import BlankTile from './BlankTile';
import AppImage from '../ui/AppImage';
import CenteredMenu from '../ui/CenteredMenu';
import AppHeading from '../typography/AppHeading';
import AppText from '../typography/AppText';
import useConfirmAction from '@/hooks/useConfirmAction';
import { getImageSource } from '@/utils';
import AppButton from '../ui/button/AppButton';

interface SelectTileProps {
  title: string;
  overlayContent?: JSX.Element;
  initialValue?: string;
  validOptions?: string[];
  subtitle?: string;
  confirmAction?: ConfirmActionType;
  icon?: React.JSX.Element;
  action?: () => void;
  settingsAction?: (value: string) => void;
  hideHeading?: boolean;
}

const SelectTile = ({
  confirmAction,
  validOptions = [],
  title,
  icon,
  subtitle,
  action,
  initialValue,
  overlayContent,
  settingsAction,
  hideHeading = false,
}: SelectTileProps) => {
  const [helpOverlay, toggleHelpOverlay] = useState(false);
  const { showConfirmAction } = useConfirmAction();
  const setPrefs = (value: number) => {
    if (settingsAction) {
      settingsAction(validOptions[value]);
    }
  };
  const actionHandler = (key: number) => {
    toggleHelpOverlay(false);
    setPrefs(key);
    if (confirmAction) showConfirmAction(confirmAction);
  };
  const options = validOptions.map((opt, key) =>
    opt.includes('.png') ? (
      <AppImage
        image={getImageSource(opt)}
        size={25}
        key={key}
        onClick={actionHandler.bind(this, key)}
        style={{ margin: 10, alignSelf: 'center' }}
      />
    ) : (
      <AppButton actionHandler={actionHandler.bind(this, key)} key={key} actionLabel={opt} variant={1} size={0} />
    ),
  );
  return (
    <>
      <BlankTile
        icon={icon}
        onClickHandler={() => toggleHelpOverlay(true)}
        currentValue={initialValue}
        title={title}
        subtitle={subtitle}
      />
      {helpOverlay && (
        <CenteredMenu
          style={{ margin: "auto", maxWidth: "90%", padding: 20 }}
          onCloseHandler={() => {
            toggleHelpOverlay(false);
            if (confirmAction) showConfirmAction(confirmAction);
            else if (action) action();
          }}
          hideCloseButton
        >
          {hideHeading === false && (
            <AppHeading text={`${title}`} fontSizeIndex={2} />
          )}
          {subtitle && <AppText text={`(${subtitle})`} fontSizeIndex={1} />}
          {overlayContent ?? options}
        </CenteredMenu>
      )}
    </>
  );
};

export default SelectTile;
