import React from 'react';
import { type ComponentProps } from 'react';
import DitchView from '../ui/DitchView';
import { ditchColors, TapMode } from '@/DitchStatics';
import DitchText from '../typography/DitchText';
import DitchIcon from '../ui/DitchIcon';
import BlankButton from '../ui/button/BlankButton';
import useUtils from '@/hooks/useUtils';

type TabBarProps = {
  badgeNumber?: number;
  name: string;
  icon: ComponentProps<typeof DitchIcon>['name'];
  onClickHandler: () => void;
  focussed?: boolean;
};

export function TabBarIcon({ badgeNumber, name, icon, onClickHandler, focussed}: TabBarProps) {
  const { tapMode } = useUtils();
  const disabled = tapMode === TapMode.fetchingPaths;
  return (
    <BlankButton
      style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}
      onClickHandler={disabled ? () => {} : onClickHandler}
    >
      <DitchView
        style={{ backgroundColor: focussed ? ditchColors.lightBlue : 'transparent', borderRadius: 9999, width: 52, paddingVertical: 2 }}
      >
        {badgeNumber !== undefined && (
          <DitchView
            style={{
              backgroundColor: `${ditchColors.buttonRed}`,
              borderRadius: 99999,
              minHeight: 18,
              minWidth: 18,
              padding: 1.5,
              position: 'absolute',
              right: 10,
              top: 0,
              display: 'flex',
              zIndex: 1000,
              justifyContent: 'center',
              alignItems: 'center',
              aspectRatio: 1,
            }}
          >
            <DitchText text={badgeNumber.toString()} fontSizeIndex={0} textStyles={{ color: 'white' }} fontSize={10} />
          </DitchView>
        )}
        <DitchIcon size={22} name={icon} style={{ margin: 'auto' }} />
      </DitchView>
      <DitchText text={name} fontSizeIndex={1} textStyles={{ textAlign: 'center' }} fontFamily="Arial" />
    </BlankButton>
  );
}
