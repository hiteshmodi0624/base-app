import React, { useState } from 'react';
import { setDitchCognitoEnvironment } from '@/utils';
import { ConfirmActionType } from '../shared/ConfirmAction';
import BlankTile from './BlankTile';
import DitchButton from '../ui/button/DitchButton';
import { CognitoEnvironmentLabels } from '../../DitchStatics';
import usePrefs from '../../hooks/usePrefs';
import DitchImage from '../ui/DitchImage';
import CenteredMenu from '../ui/CenteredMenu';
import DitchHeading from '../typography/DitchHeading';
import DitchText from '../typography/DitchText';
import { getImageSource } from '@/utils';
import useConfirmAction from '@/hooks/useConfirmAction';
import useCognito from '@/hooks/useCognito';

interface SelectTileProps {
  title: string;
  overlayContent?: JSX.Element;
  initialValue?: string;
  userSettingsKey?: DitchPrefsOfValueType<number>;
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
  userSettingsKey,
  title,
  icon,
  subtitle,
  action,
  initialValue,
  overlayContent,
  settingsAction,
  hideHeading = false,
}: SelectTileProps) => {
  const { setPref, getPref } = usePrefs();
  const [helpOverlay, toggleHelpOverlay] = useState(false);
  const { showConfirmAction } = useConfirmAction();
  const { cognitoLabel } = useCognito();
  const setPrefs = (value: number) => {
    if (title === 'Cognito') {
      setDitchCognitoEnvironment(CognitoEnvironmentLabels[value]);
    } else if (userSettingsKey) {
      setPref(userSettingsKey, value);
    } else if (settingsAction) {
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
      <DitchImage
        image={getImageSource(opt)}
        size={25}
        key={key}
        onClick={actionHandler.bind(this, key)}
        style={{ margin: 10, alignSelf: 'center' }}
      />
    ) : (
      <DitchButton actionHandler={actionHandler.bind(this, key)} key={key} actionLabel={opt} variant={1} size={0} />
    ),
  );
  return (
    <>
      <BlankTile
        icon={icon}
        onClickHandler={() => toggleHelpOverlay(true)}
        currentValue={
          userSettingsKey ? validOptions[getPref(userSettingsKey) as number] : title === 'Cognito' ? cognitoLabel : initialValue
        }
        title={title}
        subtitle={subtitle}
      />
      {helpOverlay && (
        <CenteredMenu
          style={{ margin: 'auto', maxWidth: '90%', padding: 20 }}
          onCloseHandler={() => {
            toggleHelpOverlay(false);
            if (confirmAction) showConfirmAction(confirmAction);
            else if (action) action();
          }}
          hideCloseButton
        >
          {hideHeading === false && <DitchHeading text={`${title}`} fontSizeIndex={2} />}
          {subtitle && <DitchText text={`(${subtitle})`} fontSizeIndex={1} />}
          {overlayContent ?? options}
        </CenteredMenu>
      )}
    </>
  );
};

export default SelectTile;
