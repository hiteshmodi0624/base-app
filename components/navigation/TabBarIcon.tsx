import React from 'react';
import { type ComponentProps } from 'react';
import AppView from '../ui/AppView';
import { appColors } from '@/Statics';
import AppText from '../typography/AppText';
import AppIcon from '../ui/AppIcon';
import BlankButton from '../ui/button/BlankButton';

type TabBarProps = {
  badgeNumber?: number;
  name: string;
  icon: ComponentProps<typeof AppIcon>['name'];
  onClickHandler: () => void;
  focussed?: boolean;
};

export function TabBarIcon({ badgeNumber, name, icon, onClickHandler, focussed}: TabBarProps) {
  return (
    <BlankButton
      style={{ position: 'relative', justifyContent: 'center', alignItems: 'center' }}
      onClickHandler={onClickHandler}
    >
      <AppView
        style={{ backgroundColor: focussed ? appColors.lightBlue : 'transparent', borderRadius: 9999, width: 52, paddingVertical: 2 }}
      >
        {badgeNumber !== undefined && (
          <AppView
            style={{
              backgroundColor: `${appColors.buttonRed}`,
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
            <AppText text={badgeNumber.toString()} fontSizeIndex={0} textStyles={{ color: 'white' }} fontSize={10} />
          </AppView>
        )}
        <AppIcon size={22} name={icon} style={{ margin: 'auto' }} />
      </AppView>
      <AppText text={name} fontSizeIndex={1} textStyles={{ textAlign: 'center' }} fontFamily="Arial" />
    </BlankButton>
  );
}
