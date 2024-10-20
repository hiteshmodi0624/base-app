import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import BlankButton from './button/BlankButton';
import { appColors } from '@/Statics';
import CloseButton from '../shared/CloseButton';

export interface AppModalProps extends PropsWithChildren {
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  onCloseHandler?: () => void;
  hideCloseButton?: boolean;
}

const AppModal = ({ children, style, onCloseHandler, containerStyle,hideCloseButton }: AppModalProps) => {
  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <BlankButton
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          position: 'absolute',
        }}
        onClickHandler={onCloseHandler}
      />
      <View style={[styles.AppModal, style]}>
        {children}
        {hideCloseButton !== true && onCloseHandler && <CloseButton onCloseHandler={onCloseHandler} />}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    top: 0,
    left: 0,
    zIndex: 10,
  },
  AppModal: {
    backgroundColor: appColors.background,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AppModal;
