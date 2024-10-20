import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import AppImage from '../ui/AppImage';
import AppText from '../typography/AppText';
import AppIcon from '../ui/AppIcon';
import useUtils from '@/hooks/useUtils';
import BlankButton from '../ui/button/BlankButton';
import { getImageSource } from '@/utils';

interface BlankTileProps extends PropsWithChildren {
  title?: string;
  hideNextIcon?: boolean;
  titleFontSizeIndex?: number;
  icon?: React.JSX.Element;
  hideBorder?: boolean;
  subtitle?: string;
  showSubtile?: boolean;
  onClickHandler?: () => void;
  currentValue?: string | number;
}

const BlankTile = ({
  onClickHandler,
  icon,
  currentValue,
  title,
  children,
  hideNextIcon,
  subtitle,
  showSubtile,
  titleFontSizeIndex,
  hideBorder,
}: BlankTileProps) => {

  const showTitle = title !== undefined || currentValue !== undefined;
  return (
    <BlankButton
      style={[styles.settingsTile, hideBorder ? styles.settingsTileWithoutBorder : {}]}
      onClickHandler={() => {
        if (onClickHandler) onClickHandler();
      }}
    >
      <View style={styles.settingsTileInner}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        {showTitle && (
          <View style={styles.contentContainer}>
            <View style={{ width: currentValue ? '60%' : '100%' }}>
              {title && <AppText text={title} fontSizeIndex={titleFontSizeIndex ?? 2} />}
              {showSubtile && subtitle && <AppText text={subtitle} fontSizeIndex={0} />}
            </View>
            {currentValue && typeof currentValue === 'string' && currentValue.includes('.png') ? (
              <AppImage image={getImageSource(currentValue)} size={25} />
            ) : (
              <AppText text={currentValue?.toString()} fontSizeIndex={1} styles={{ alignItems: 'flex-end', width: '40%' }} />
            )}
          </View>
        )}
        {!hideNextIcon && <AppIcon name="navigate-next" style={styles.nextIcon} />}
        {children}
      </View>
    </BlankButton>
  );
};

const styles = StyleSheet.create({
  settingsTile: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 0.2,
    borderBottomColor: '#ccc',
  },
  settingsTileWithoutBorder: {
    borderBottomWidth: 0,
  },
  settingsTileInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginRight: 10,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  nextIcon: {
    color: 'gray',
  },
});

export default BlankTile;
