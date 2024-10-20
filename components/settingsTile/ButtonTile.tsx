import React from 'react';
import { ConfirmActionType } from '../shared/ConfirmAction';
import BlankTile from './BlankTile';
import useConfirmAction from '@/hooks/useConfirmAction';

interface ButtonTileProps {
  initialValue?: string | number;
  icon?: React.JSX.Element;
  title: string;
  action?: () => void;
  subtitle?: string;
  hideNextIcon?: boolean;
  titleFontSizeIndex?: number;
  confirmAction?: ConfirmActionType;
}

const ButtonTile = ({ initialValue, icon, title, confirmAction, action, subtitle, hideNextIcon, titleFontSizeIndex }: ButtonTileProps) => {
  const { showConfirmAction } = useConfirmAction();
  return (
    <BlankTile
      currentValue={initialValue}
      icon={icon}
      onClickHandler={() => {
        if (confirmAction) showConfirmAction(confirmAction);
        confirmAction ? () => {} : action ? action() : undefined;
      }}
      title={title}
      subtitle={subtitle}
      hideNextIcon={hideNextIcon}
      titleFontSizeIndex={titleFontSizeIndex}
    />
  );
};
export default ButtonTile;
