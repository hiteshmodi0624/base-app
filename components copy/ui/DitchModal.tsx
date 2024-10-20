import React, { PropsWithChildren } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import BlankButton from './button/BlankButton';
import { ditchColors } from '@/DitchStatics';
import CloseButton from '../shared/CloseButton';

export interface DitchModalProps extends PropsWithChildren {
  style?: ViewStyle | ViewStyle[];
  containerStyle?: ViewStyle | ViewStyle[];
  onCloseHandler?: () => void;
  hideCloseButton?: boolean;
}

const DitchModal = ({ children, style, onCloseHandler, containerStyle,hideCloseButton }: DitchModalProps) => {
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
      <View style={[styles.DitchModal, style]}>
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
  DitchModal: {
    backgroundColor: ditchColors.background,
    borderRadius: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DitchModal;
