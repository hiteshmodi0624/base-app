import { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, ViewStyle, GestureResponderEvent, Animated } from 'react-native';
import React from 'react';
import { log } from '@/utils';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


interface BlankButtonProps extends PropsWithChildren {
  onClickHandler?: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}
const animated = new Animated.Value(1);

const fadeIn = () => {
  Animated.timing(animated, {
    toValue: 0.95,
    duration: 100,
    useNativeDriver: false,
  }).start();
};
const fadeOut = () => {
  Animated.timing(animated, {
    toValue: 1,
    duration: 200,
    useNativeDriver: false,
  }).start();
};

const BlankButton = ({ children, onClickHandler, style, disabled = false }: BlankButtonProps) => {
  return (
    <AnimatedPressable
      onPress={
        onClickHandler ??
        ((e) => {
          log(e);
          e.stopPropagation();
        })
      }
      style={[styles.button, style, { opacity: animated }]}
      disabled={disabled}
      onPressIn={onClickHandler ? fadeIn : undefined}
      onPressOut={onClickHandler ? fadeOut : undefined}
    >
      {children}
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderColor: 'transparent',
    padding: 0,
    margin: 0,
    minWidth: 0,
    display: 'flex',
  },
});

export default BlankButton;
